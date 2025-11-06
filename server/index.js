import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import crypto from "crypto";

dotenv.config();

const app = express();

// Trust reverse proxy (Render) so secure cookies work correctly
app.set("trust proxy", 1);

// Core middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// CORS
const ORIGINS = [
  "http://localhost:3000",
  "https://jb-coach-6862.vercel.app",
];
app.use(
  cors({
    origin: (origin, cb) => cb(null, ORIGINS.includes(origin) || !origin),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Cookie options (prod = Secure + SameSite=None)
const isProd = process.env.NODE_ENV === "production";
const cookieOpts = {
  httpOnly: true,
  sameSite: isProd ? "none" : "lax",
  secure: isProd, // must be true for SameSite=None
  path: "/",
  maxAge: 15 * 60 * 1000, // 15 min
};

// SQLite
const dbPromise = open({
  filename: "./db.sqlite",
  driver: sqlite3.Database,
});

let db;
(async () => {
  db = await dbPromise;
  await db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password_hash TEXT,
      role TEXT
    );

    CREATE TABLE IF NOT EXISTS week_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      week INTEGER NOT NULL,
      data TEXT,
      updated_at TEXT,
      UNIQUE(user_id, week)
    );

    CREATE TABLE IF NOT EXISTS password_resets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token_hash TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used_at TEXT,
      created_at TEXT DEFAULT (CURRENT_TIMESTAMP)
    );

    CREATE INDEX IF NOT EXISTS idx_password_resets_user ON password_resets(user_id);
    CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token_hash);
  `);
})();

// Auth middleware
function authRequired(req, res, next) {
  try {
    const token =
      req.cookies.access_token ||
      req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Missing token" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Password policy helper
function validatePassword(pw) {
  if (typeof pw !== "string") return false;
  if (pw.length < 8) return false;
  const hasLower = /[a-z]/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasDigit = /\d/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  return hasLower && hasUpper && hasDigit && hasSpecial;
}

// Health
app.get("/health", (req, res) => res.json({ ok: true }));

// SIGNUP — unique email + bcrypt + cookie
app.post("/signup", async (req, res) => {
  try {
    let { email, password, role } = req.body || {};
    if (!email || !password || !role) {
      return res.status(400).json({ error: "Missing email, password, or role." });
    }

    email = String(email).trim().toLowerCase();
    role = role === "coach" ? "coach" : "client";

    if (!validatePassword(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters and include lowercase, uppercase, number, and special character.",
      });
    }

    const bcrypt = (await import("bcrypt")).default;
    const password_hash = await bcrypt.hash(password, 12);

    await db.run(
      `INSERT INTO users (email, password_hash, role) VALUES (?,?,?)`,
      [email, password_hash, role]
    );

    const user = await db.get(
      `SELECT id, email, role FROM users WHERE email = ?`,
      [email]
    );

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("access_token", accessToken, cookieOpts);
    return res.json({ success: true, user });
  } catch (err) {
    if (err && (err.code === "SQLITE_CONSTRAINT" || err.message?.includes("UNIQUE"))) {
      return res.status(409).json({ error: "Email already in use." });
    }
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Signup failed." });
  }
});

// LOGIN — bcrypt compare + cookie
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password." });
    }

    const user = await db.get(`SELECT * FROM users WHERE email = ?`, [
      String(email).toLowerCase(),
    ]);
    if (!user) return res.status(401).json({ error: "Invalid credentials." });

    const bcrypt = (await import("bcrypt")).default;
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials." });

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("access_token", accessToken, cookieOpts);
    return res.json({
      success: true,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Login failed." });
  }
});

// LOGOUT — clear cookie with matching attributes
app.post("/logout", (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    path: "/",
  });
  return res.json({ success: true });
});

// WHOAMI
app.get("/me", authRequired, async (req, res) => {
  res.json(req.user);
});

// COACH: list clients
app.get("/clients", authRequired, async (req, res) => {
  if (req.user.role !== "coach") return res.status(403).json({ error: "Forbidden" });
  const clients = await db.all(`SELECT id, email FROM users WHERE role='client'`);
  res.json({ clients });
});

// SAVE week data (self or coach)
app.post("/clients/:id/weeks/:week", authRequired, async (req, res) => {
  const targetUserId = Number(req.params.id);
  const week = Number(req.params.week);
  const isSelf = req.user.id === targetUserId;
  const canWrite = isSelf || req.user.role === "coach";
  if (!canWrite) return res.status(403).json({ error: "Forbidden" });

  const payload = JSON.stringify(req.body ?? {});
  await db.run(
    `
    INSERT INTO week_data (user_id, week, data, updated_at)
    VALUES (?,?,?,CURRENT_TIMESTAMP)
    ON CONFLICT(user_id, week)
    DO UPDATE SET data=excluded.data, updated_at=CURRENT_TIMESTAMP
    `,
    [targetUserId, week, payload]
  );

  res.json({ success: true });
});

// LOAD week data (self or coach)
app.get("/clients/:id/weeks/:week", authRequired, async (req, res) => {
  const targetUserId = Number(req.params.id);
  const week = Number(req.params.week);
  const isSelf = req.user.id === targetUserId;
  const canRead = isSelf || req.user.role === "coach";
  if (!canRead) return res.status(403).json({ error: "Forbidden" });

  const row = await db.get(
    `SELECT data, updated_at FROM week_data WHERE user_id=? AND week=?`,
    [targetUserId, week]
  );
  res.json({
    data: row?.data ? JSON.parse(row.data) : null,
    updated_at: row?.updated_at || null,
  });
});

// FORGOT — issue one-time reset link
app.post("/auth/forgot", async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: "Missing email." });

    const user = await db.get(
      `SELECT id, email FROM users WHERE email = ?`,
      [String(email).toLowerCase()]
    );
    if (!user) return res.json({ success: true }); // do not reveal existence

    await db.run(
      `UPDATE password_resets SET used_at = CURRENT_TIMESTAMP WHERE user_id = ? AND used_at IS NULL`,
      [user.id]
    );

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    await db.run(
      `INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (?,?,?)`,
      [user.id, tokenHash, expiresAt]
    );

    const base = process.env.FRONTEND_URL || "http://localhost:3000";
    const reset_url = `${base}/reset?token=${rawToken}&email=${encodeURIComponent(
      user.email
    )}`;

    return res.json({ success: true, reset_url });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ error: "Unable to create reset token." });
  }
});

// RESET — verify token and update password
app.post("/auth/reset", async (req, res) => {
  try {
    const { email, token, new_password } = req.body || {};
    if (!email || !token || !new_password) {
      return res.status(400).json({ error: "Missing email, token, or new_password." });
    }
    if (!validatePassword(new_password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters and include lowercase, uppercase, number, and special character.",
      });
    }

    const user = await db.get(
      `SELECT id, email FROM users WHERE email = ?`,
      [String(email).toLowerCase()]
    );
    if (!user) return res.status(400).json({ error: "Invalid reset request." });

    const record = await db.get(
      `
      SELECT id, token_hash, expires_at, used_at
      FROM password_resets
      WHERE user_id = ? AND used_at IS NULL
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [user.id]
    );
    if (!record) return res.status(400).json({ error: "Invalid or already used token." });
    if (record.used_at) return res.status(400).json({ error: "Token already used." });
    if (new Date(record.expires_at).getTime() < Date.now()) {
      return res.status(400).json({ error: "Token expired." });
    }

    const calcHash = crypto.createHash("sha256").update(String(token)).digest("hex");
    if (calcHash !== record.token_hash) {
      return res.status(400).json({ error: "Invalid token." });
    }

    const bcrypt = (await import("bcrypt")).default;
    const new_hash = await bcrypt.hash(new_password, 12);
    await db.run(`UPDATE users SET password_hash = ? WHERE id = ?`, [new_hash, user.id]);
    await db.run(`UPDATE password_resets SET used_at = CURRENT_TIMESTAMP WHERE id = ?`, [record.id]);

    return res.json({ success: true });
  } catch (err) {
    console.error("Reset error:", err);
    return res.status(500).json({ error: "Unable to reset password." });
  }
});

// Start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

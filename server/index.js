import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.set("trust proxy", 1); // Render behind proxy

const ORIGINS = [
  "https://jb-coach-6862.vercel.app",
  "http://localhost:3000"
];

app.use(helmet());


app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
// Handle CORS preflight cleanly for all routes
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ["http://localhost:3000"].includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Vary", "Origin");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});


app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

const authLimiter = rateLimit({ windowMs: 15*60*1000, max: 100 });
app.use(["/login","/signup","/auth/refresh"], authLimiter);

const {
  JWT_SECRET = "dev-secret-change-me",
  JWT_REFRESH_SECRET = "dev-refresh-secret-change-me",
  ACCESS_TOKEN_TTL = "15m",
  REFRESH_TOKEN_TTL_SECONDS = 60*60*24*7
} = process.env;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
};

// DB open
let db;
(async () => {
  db = await open({ filename: "./db.sqlite", driver: sqlite3.Database });
  await db.exec(`PRAGMA foreign_keys = ON;`);
})();

// helpers
function signAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
}
function signRefreshToken(payload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_TTL_SECONDS });
}
function nowPlusSeconds(s) {
  return new Date(Date.now() + s*1000);
}

// refresh token storage (hash)
async function saveRefreshToken(userId, rawToken, expiresAt) {
  const token_hash = await bcrypt.hash(rawToken, 10);
  await db.run(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?,?,?)`,
    [userId, token_hash, expiresAt.toISOString()]
  );
}
async function rotateRefreshToken(oldRaw, userId) {
  const rows = await db.all(`SELECT id, token_hash FROM refresh_tokens WHERE user_id=? AND revoked_at IS NULL`, [userId]);
  for (const r of rows) {
    const ok = await bcrypt.compare(oldRaw, r.token_hash);
    if (ok) {
      await db.run(`UPDATE refresh_tokens SET revoked_at=CURRENT_TIMESTAMP WHERE id=?`, [r.id]);
      break;
    }
  }
}
async function isValidRefresh(userId, raw) {
  const rows = await db.all(
    `SELECT token_hash, expires_at FROM refresh_tokens
     WHERE user_id=? AND revoked_at IS NULL AND DATETIME(expires_at) > DATETIME('now')`,
    [userId]
  );
  for (const r of rows) {
    if (await bcrypt.compare(raw, r.token_hash)) return true;
  }
  return false;
}

// auth middlewares
function authRequired(req, res, next) {
  const raw = req.cookies.accessToken || (req.headers.authorization || "").replace("Bearer ","").trim();
  if (!raw) return res.status(401).json({ error: "Missing token" });
  try {
    const payload = jwt.verify(raw, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) return res.status(403).json({ error: "Forbidden" });
    next();
  };
}

// health
app.get("/health", (_req, res) => res.json({ ok: true }));

// SIGNUP
app.post("/signup", async (req, res) => {
  const { email, password, role } = req.body || {};
  if (!email || !password || !["coach","client"].includes(role)) {
    return res.status(400).json({ error: "Email, password, and valid role required" });
  }
  const hash = await bcrypt.hash(password, 12);
  try {
    const result = await db.run(
      `INSERT INTO users (email, password_hash, role) VALUES (?,?,?)`,
      [email, hash, role]
    );
    const user = { id: result.lastID, email, role };
    const access = signAccessToken(user);
    const refresh = signRefreshToken({ id: user.id });
    await saveRefreshToken(user.id, refresh, nowPlusSeconds(parseInt(REFRESH_TOKEN_TTL_SECONDS,10)));

    res.cookie("accessToken", access, { ...COOKIE_OPTIONS, maxAge: 15*60*1000 });
    res.cookie("refreshToken", refresh, { ...COOKIE_OPTIONS, maxAge: parseInt(REFRESH_TOKEN_TTL_SECONDS,10)*1000 });
    return res.json({ success: true, user });
  } catch (e) {
    if (String(e).includes("UNIQUE")) return res.status(409).json({ error: "Email already registered" });
    return res.status(500).json({ error: "Signup failed" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

  const row = await db.get(`SELECT * FROM users WHERE email=?`, [email]);
  if (!row) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const user = { id: row.id, email: row.email, role: row.role };
  const access = signAccessToken(user);
  const refresh = signRefreshToken({ id: row.id });
  await saveRefreshToken(row.id, refresh, nowPlusSeconds(parseInt(REFRESH_TOKEN_TTL_SECONDS,10)));

  res.cookie("accessToken", access, { ...COOKIE_OPTIONS, maxAge: 15*60*1000 });
  res.cookie("refreshToken", refresh, { ...COOKIE_OPTIONS, maxAge: parseInt(REFRESH_TOKEN_TTL_SECONDS,10)*1000 });
  return res.json({ success: true, user });
});

// ME
app.get("/health", (req, res) => res.json({ ok: true }));
app.get("/me", authRequired, async (req, res) => {
  res.set("Cache-Control", "no-store");
  return res.json({ id: req.user.id, email: req.user.email, role: req.user.role });
});


// REFRESH
app.post("/auth/refresh", async (req, res) => {
  const refresh = req.cookies.refreshToken;
  if (!refresh) return res.status(401).json({ error: "Missing refresh token" });
  try {
    const { id } = jwt.verify(refresh, JWT_REFRESH_SECRET);
    const ok = await isValidRefresh(id, refresh);
    if (!ok) return res.status(401).json({ error: "Invalid refresh token" });

    await rotateRefreshToken(refresh, id);
    const newRefresh = signRefreshToken({ id });
    await saveRefreshToken(id, newRefresh, nowPlusSeconds(parseInt(REFRESH_TOKEN_TTL_SECONDS,10)));

    const row = await db.get(`SELECT id,email,role FROM users WHERE id=?`, [id]);
    const access = signAccessToken({ id: row.id, email: row.email, role: row.role });

    res.cookie("accessToken", access, { ...COOKIE_OPTIONS, maxAge: 15*60*1000 });
    res.cookie("refreshToken", newRefresh, { ...COOKIE_OPTIONS, maxAge: parseInt(REFRESH_TOKEN_TTL_SECONDS,10)*1000 });
    return res.json({ success: true });
  } catch {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});

// LOGOUT
app.post("/logout", authRequired, async (req, res) => {
  const refresh = req.cookies.refreshToken;
  if (refresh) await rotateRefreshToken(refresh, req.user.id);
  res.clearCookie("accessToken", COOKIE_OPTIONS);
  res.clearCookie("refreshToken", COOKIE_OPTIONS);
  return res.json({ success: true });
});

// COACH-ONLY: list clients
app.get("/clients", authRequired, requireRole("coach"), async (_req, res) => {
  const clients = await db.all(`SELECT id,email FROM users WHERE role='client'`);
  res.json({ clients });
});

// WEEK DATA (self or coach)
app.post("/clients/:id/weeks/:week", authRequired, async (req, res) => {
  const targetUserId = Number(req.params.id);
  const week = Number(req.params.week);
  const isSelf = req.user.id === targetUserId;
  const canWrite = isSelf || req.user.role === "coach";
  if (!canWrite) return res.status(403).json({ error: "Forbidden" });
  const payload = JSON.stringify(req.body || {});
  await db.run(`
    INSERT INTO week_data (user_id, week, data, updated_at)
    VALUES (?,?,?,CURRENT_TIMESTAMP)
    ON CONFLICT(user_id,week) DO UPDATE SET data=excluded.data, updated_at=CURRENT_TIMESTAMP
  `, [targetUserId, week, payload]);
  res.json({ success: true });
});

app.get("/clients/:id/weeks/:week", authRequired, async (req, res) => {
  const targetUserId = Number(req.params.id);
  const week = Number(req.params.week);
  const isSelf = req.user.id === targetUserId;
  const canRead = isSelf || req.user.role === "coach";
  if (!canRead) return res.status(403).json({ error: "Forbidden" });
  const row = await db.get(`SELECT data, updated_at FROM week_data WHERE user_id=? AND week=?`, [targetUserId, week]);
  res.json({ data: row?.data ? JSON.parse(row.data) : null, updated_at: row?.updated_at || null });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

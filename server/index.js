// index.js — Express API with JWT auth + client week storage (SQLite)
// ESM compatible (package.json has "type":"module")

import "dotenv/config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sqlite3 from "sqlite3";

// -------------------------
// Config
// -------------------------
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// -------------------------
// Database (SQLite)
// -------------------------
sqlite3.verbose();
const db = new sqlite3.Database("./app.db");

// Create tables if they don't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS client_weeks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      week INTEGER NOT NULL,
      data TEXT,
      updated_at TEXT NOT NULL,
      UNIQUE (client_id, week)
    )
  `);
});

// -------------------------
// App + Middleware
// -------------------------
const app = express();
app.use(cors());
app.use(express.json());

// Auth middleware
function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "No token" });
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

// -------------------------
// Auth routes
// -------------------------
app.post("/signup", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Email and password required." });
  const hash = bcrypt.hashSync(password, 10);
  const stmt = db.prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)");
  stmt.run(email, hash, function (err) {
    if (err) {
      if (String(err.message).includes("UNIQUE")) {
        return res.status(409).json({ error: "Email already exists." });
      }
      return res.status(500).json({ error: "Signup failed." });
    }
    return res.json({ success: true, user: { id: this.lastID, email } });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Email and password required." });

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    if (err) return res.status(500).json({ error: "Login failed." });
    if (!row) return res.status(401).json({ error: "Invalid credentials." });
    const ok = bcrypt.compareSync(password, row.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials." });

    const token = jwt.sign({ sub: row.id, email: row.email }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, user: { id: row.id, email: row.email } });
  });
});

app.get("/me", auth, (req, res) => {
  return res.json({ user: { id: req.user.id, email: req.user.email } });
});

// -------------------------
// Coach: clients list (mock for now)
// -------------------------
const MOCK_CLIENTS = [
  { id: 101, name: "Alicia Brown", email: "alicia@example.com", currentWeek: 7,  lastActive: "2025-10-01" },
  { id: 102, name: "Ben Carter",   email: "ben@example.com",    currentWeek: 3,  lastActive: "2025-09-29" },
  { id: 103, name: "Chloe Diaz",   email: "chloe@example.com",  currentWeek: 12, lastActive: "2025-10-04" },
];

app.get("/clients", auth, (req, res) => {
  return res.json({ clients: MOCK_CLIENTS });
});

// -------------------------
// NEW: Week data (GET + SAVE)
// -------------------------

// Get a client’s week data (read-only view).
app.get("/clients/:id/weeks/:week", auth, (req, res) => {
  const clientId = Number(req.params.id);
  const week = Number(req.params.week);
  if (!clientId || !week) return res.status(400).json({ error: "Bad params." });

  db.get(
    "SELECT data, updated_at FROM client_weeks WHERE client_id = ? AND week = ?",
    [clientId, week],
    (err, row) => {
      if (err) return res.status(500).json({ error: "DB error." });
      if (!row) return res.json({ clientId, week, data: null, updatedAt: null });
      let data = null;
      try { data = row.data ? JSON.parse(row.data) : null; } catch {}
      return res.json({ clientId, week, data, updatedAt: row.updated_at });
    }
  );
});

// Save (create or update) a client’s week data.
app.post("/clients/:id/weeks/:week", auth, (req, res) => {
  const clientId = Number(req.params.id);
  const week = Number(req.params.week);
  const payload = req.body?.data ?? null; // any JSON object
  if (!clientId || !week) return res.status(400).json({ error: "Bad params." });

  const json = JSON.stringify(payload ?? null);
  const now = new Date().toISOString();

  // UPSERT using INSERT OR REPLACE on the UNIQUE(client_id, week)
  db.run(
    `
    INSERT INTO client_weeks (client_id, week, data, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(client_id, week) DO UPDATE SET
      data = excluded.data,
      updated_at = excluded.updated_at
    `,
    [clientId, week, json, now],
    function (err) {
      if (err) return res.status(500).json({ error: "DB write error." });
      return res.json({ ok: true, clientId, week, updatedAt: now });
    }
  );
});

// -------------------------
// Start
// -------------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

import sqlite3 from "sqlite3";
import { open } from "sqlite";

sqlite3.verbose();

const dbPromise = open({
  filename: "./users.db",
  driver: sqlite3.Database,
});

export async function initDB() {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);
  return db;
}

export default dbPromise;


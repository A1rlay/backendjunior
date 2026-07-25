import Database from "better-sqlite3";
const db = new Database("auth.db");

db.exec(`
	CREATE TABLE IF NOT EXISTS users(
		id	INTEGER PRIMARY KEY AUTOINCREMENT,
		email TEXT UNIQUE NOT NULL,
		password_hash TEXT NOT NULL,
		created_at TEXT NOT NULL DEFAULT (datetime('now'))
	)
`);

export default db;

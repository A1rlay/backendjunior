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

db.exec(`
	CREATE TABLE IF NOT EXISTS refresh_tokens(
		token TEXT PRIMARY KEY,
		user_id INTEGER NOT NULL,
		expires_at TEXT NOT NULL,
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
	)
`);

export default db;

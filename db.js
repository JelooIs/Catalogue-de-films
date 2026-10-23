const Database = require('better-sqlite3');
const db = new Database('movies.db');


db.pragma('foreign_keys = ON');

db.exec(`
    CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    genre TEXT NOT NULL,
    year INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id INTEGER NOT NULL,
    value INTEGER NOT NULL CHECK(value BETWEEN 1 AND 5),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
    );
`);

module.exports = db;
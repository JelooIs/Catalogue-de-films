const Database = require('better-sqlite3');

function openDatabase(databasePath) {
    const db = new Database(databasePath);

    db.exec(`
        CREATE TABLE IF NOT EXISTS movies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            genre TEXT NOT NULL,
            year INTEGER NOT NULL,
            rating INTEGER DEFAULT NULL CHECK (rating IS NULL OR (rating BETWEEN 1 AND 5)),
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
    `);

    return db;
}

module.exports = { openDatabase };

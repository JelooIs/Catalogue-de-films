class SqliteMovieRepository {
    constructor(db) {
        this.db = db;
    }

    findAll() {
        return this.db.prepare('SELECT * FROM movies ORDER BY title COLLATE NOCASE').all();
    }

    findByGenre(genre) {
        return this.db
            .prepare('SELECT * FROM movies WHERE genre = ? ORDER BY title COLLATE NOCASE')
            .all(genre);
    }

    findById(id) {
        return this.db.prepare('SELECT * FROM movies WHERE id = ?').get(id);
    }

    createMovie({ title, genre, year }) {
        const result = this.db
            .prepare('INSERT INTO movies (title, genre, year) VALUES (?, ?, ?)')
            .run(title, genre, year);

        return this.findById(result.lastInsertRowid);
    }

    updateRating(id, rating) {
        this.db.prepare('UPDATE movies SET rating = ? WHERE id = ?').run(rating, id);
        return this.findById(id);
    }

    deleteById(id) {
        return this.db.prepare('DELETE FROM movies WHERE id = ?').run(id).changes > 0;
    }
}

module.exports = SqliteMovieRepository;

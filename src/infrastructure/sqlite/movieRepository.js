const SELECT_MOVIES = `
    SELECT movies.id, movies.title, movies.genre, movies.year, movies.created_at,
           ROUND(AVG(ratings.value), 1) AS rating,
           COUNT(ratings.id) AS ratings_count
    FROM movies
    LEFT JOIN ratings ON ratings.movie_id = movies.id
`;

class MovieRepository {
    constructor(db) {
        this.db = db;
    }

    findAll(genre) {
        const genreFilter = genre === undefined ? '' : ' WHERE movies.genre = ?';
        const query = `${SELECT_MOVIES}${genreFilter} GROUP BY movies.id ORDER BY movies.title COLLATE NOCASE`;
        const statement = this.db.prepare(query);
        return genre === undefined ? statement.all() : statement.all(genre);
    }

    findById(id) {
        return this.db.prepare(
            `${SELECT_MOVIES} WHERE movies.id = ? GROUP BY movies.id`
        ).get(id);
    }

    create({ title, genre, year }) {
        const result = this.db.prepare(
            'INSERT INTO movies (title, genre, year) VALUES (?, ?, ?)'
        ).run(title, genre, year);
        return this.findById(result.lastInsertRowid);
    }

    addRating(movieId, rating) {
        this.db.prepare(
            'INSERT INTO ratings (movie_id, value) VALUES (?, ?)'
        ).run(movieId, rating);
    }

    delete(id) {
        const result = this.db.prepare('DELETE FROM movies WHERE id = ?').run(id);
        return result.changes > 0;
    }
}

module.exports = MovieRepository;

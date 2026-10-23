const {
    GENRES,
    validateGenre,
    validateRating,
    validateTitle,
    validateYear
} = require('../domain/movie');
const { MovieNotFoundError, MovieValidationError } = require('./errors');

class MovieService {
    constructor(movieRepository) {
        this.movieRepository = movieRepository;
    }

    getGenres() {
        return GENRES;
    }

    listMovies(genre) {
        if (genre !== undefined) {
            const error = validateGenre(genre);
            if (error) throw new MovieValidationError(error);
            return this.movieRepository.findByGenre(genre);
        }
        return this.movieRepository.findAll();
    }

    createMovie({ title, genre, year }) {
        const error = validateTitle(title) || validateGenre(genre) || validateYear(year);
        if (error) throw new MovieValidationError(error);

        return this.movieRepository.createMovie({ title: title.trim(), genre, year });
    }

    updateMovieRating(id, rating) {
        if (!Number.isInteger(id)) throw new MovieNotFoundError();

        const movie = this.movieRepository.findById(id);
        if (!movie) throw new MovieNotFoundError();

        const error = validateRating(rating);
        if (error) throw new MovieValidationError(error);

        return this.movieRepository.updateRating(id, rating);
    }

    deleteMovie(id) {
        if (!Number.isInteger(id) || !this.movieRepository.deleteById(id)) {
            throw new MovieNotFoundError();
        }
    }
}

module.exports = MovieService;

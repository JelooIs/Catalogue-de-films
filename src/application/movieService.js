const GENRES = require('../domain/genres');
const {
    validateTitle,
    validateGenre,
    validateYear,
    validateRating
} = require('../domain/movieValidation');
const { ValidationError, MovieNotFoundError } = require('./errors');

class MovieService {
    constructor(movieRepository) {
        this.movieRepository = movieRepository;
    }

    listGenres() {
        return GENRES;
    }

    listMovies(genre) {
        if (genre !== undefined) {
            const error = validateGenre(genre);
            if (error) throw new ValidationError(error);
        }
        return this.movieRepository.findAll(genre);
    }

    createMovie(input) {
        const { title, genre, year } = input || {};
        const error = validateTitle(title) || validateGenre(genre) || validateYear(year);
        if (error) throw new ValidationError(error);

        return this.movieRepository.create({ title: title.trim(), genre, year });
    }

    addRating(id, input) {
        if (!Number.isInteger(id)) throw new MovieNotFoundError();
        const movie = this.movieRepository.findById(id);
        if (!movie) throw new MovieNotFoundError();

        const { rating } = input || {};
        const error = validateRating(rating);
        if (error) throw new ValidationError(error);

        this.movieRepository.addRating(id, rating);
        return this.movieRepository.findById(id);
    }

    deleteMovie(id) {
        if (!Number.isInteger(id)) throw new MovieNotFoundError();
        if (!this.movieRepository.delete(id)) {
            throw new MovieNotFoundError();
        }
    }
}

module.exports = MovieService;

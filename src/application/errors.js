class MovieValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'MovieValidationError';
    }
}

class MovieNotFoundError extends Error {
    constructor() {
        super('Film introuvable.');
        this.name = 'MovieNotFoundError';
    }
}

module.exports = { MovieNotFoundError, MovieValidationError };

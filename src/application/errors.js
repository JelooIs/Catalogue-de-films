class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

class MovieNotFoundError extends Error {
    constructor() {
        super('Film introuvable.');
        this.name = 'MovieNotFoundError';
    }
}

module.exports = { ValidationError, MovieNotFoundError };

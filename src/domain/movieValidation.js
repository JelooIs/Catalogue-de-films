const GENRES = require('./genres');

const isInteger = (value) => typeof value === 'number' && Number.isInteger(value);

function validateTitle(title) {
    if (typeof title !== 'string' || title.trim() === '') {
        return 'Le titre doit être obligatoire.';
    }
    if (title.trim().length > 100) {
        return 'ça doit pas dépasser 100 caractères.';
    }
    return null;
}

function validateGenre(genre) {
    if (!GENRES.includes(genre)) {
        return `Genre inconnu. Genres valides : ${GENRES.join(', ')}.`;
    }
    return null;
}

function validateYear(year) {
    const max = new Date().getFullYear();
    if (!isInteger(year) || year < 1888 || year > max) {
        return `L'année doit être un entier entre 1888 et ${max}.`;
    }
    return null;
}

function validateRating(rating) {
    if (!isInteger(rating) || rating < 1 || rating > 5) {
        return 'Faut que la note soit un entier entre 1 et 5.';
    }
    return null;
}

module.exports = {
    validateTitle,
    validateGenre,
    validateYear,
    validateRating
};

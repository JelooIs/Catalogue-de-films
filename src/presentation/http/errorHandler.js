const { MovieNotFoundError, MovieValidationError } = require('../../application/errors');

function errorHandler(err, req, res, next) {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Requête JSON invalide.' });
    }
    if (err instanceof MovieValidationError) {
        return res.status(400).json({ error: err.message });
    }
    if (err instanceof MovieNotFoundError) {
        return res.status(404).json({ error: err.message });
    }

    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
}

module.exports = errorHandler;

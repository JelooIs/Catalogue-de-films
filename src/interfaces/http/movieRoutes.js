const express = require('express');
const createMovieController = require('./movieController');

function createMovieRoutes(movieService) {
    const router = express.Router();
    const controller = createMovieController(movieService);

    router.get('/genres', controller.listGenres);
    router.get('/movies', controller.listMovies);
    router.post('/movies', controller.createMovie);
    router.patch('/movies/:id', controller.addRating);
    router.delete('/movies/:id', controller.deleteMovie);

    return router;
}

module.exports = createMovieRoutes;

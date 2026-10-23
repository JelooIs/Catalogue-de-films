const express = require('express');
const path = require('path');
const createMovieRoutes = require('./interfaces/http/movieRoutes');
const errorHandler = require('./interfaces/http/errorHandler');

function createApp(movieService) {
    const app = express();

    app.use(express.json());
    app.use(express.static(path.resolve(__dirname, '../public')));
    app.use('/api', createMovieRoutes(movieService));
    app.use(errorHandler);

    return app;
}

module.exports = createApp;

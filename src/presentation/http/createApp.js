const express = require('express');
const createMovieRoutes = require('./movieRoutes');
const errorHandler = require('./errorHandler');

function createApp(movieService) {
    const app = express();

    app.use(express.json());
    app.use('/api', createMovieRoutes(movieService));
    app.use(errorHandler);

    return app;
}

module.exports = createApp;

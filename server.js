const express = require('express');
const path = require('path');
const { openDatabase } = require('./src/infrastructure/database/openDatabase');
const SqliteMovieRepository = require('./src/infrastructure/database/sqliteMovieRepository');
const MovieService = require('./src/application/movieService');
const createApp = require('./src/presentation/http/createApp');

const PORT = process.env.PORT || 3000;
const db = openDatabase(path.join(__dirname, 'movies.db'));
const movieRepository = new SqliteMovieRepository(db);
const movieService = new MovieService(movieRepository);
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(createApp(movieService));

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

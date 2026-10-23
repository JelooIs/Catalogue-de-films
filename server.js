const createApp = require('./src/app');
const MovieService = require('./src/application/movieService');
const createDatabase = require('./src/infrastructure/sqlite/database');
const MovieRepository = require('./src/infrastructure/sqlite/movieRepository');

const PORT = process.env.PORT || 3000;
const database = createDatabase();
const movieRepository = new MovieRepository(database);
const movieService = new MovieService(movieRepository);
const app = createApp(movieService);

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

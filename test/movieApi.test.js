const assert = require('node:assert/strict');
const { once } = require('node:events');
const test = require('node:test');
const { openDatabase } = require('../src/infrastructure/database/openDatabase');
const SqliteMovieRepository = require('../src/infrastructure/database/sqliteMovieRepository');
const MovieService = require('../src/application/movieService');
const createApp = require('../src/presentation/http/createApp');

test('movie API preserves catalogue behavior across its layers', async () => {
    const db = openDatabase(':memory:');
    const movieRepository = new SqliteMovieRepository(db);
    const movieService = new MovieService(movieRepository);
    const server = createApp(movieService).listen(0);

    try {
        await once(server, 'listening');
        const address = server.address();
        const baseUrl = `http://127.0.0.1:${address.port}/api`;
        const request = (endpoint, options) => fetch(`${baseUrl}${endpoint}`, options);

        const genresResponse = await request('/genres');
        assert.equal(genresResponse.status, 200);
        assert.deepEqual(await genresResponse.json(), movieService.getGenres());

        const invalidMovieResponse = await request('/movies', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ title: '  ', genre: 'Inconnu', year: 2020 })
        });
        assert.equal(invalidMovieResponse.status, 400);
        assert.deepEqual(await invalidMovieResponse.json(), {
            error: 'Le titre doit être obligatoire.'
        });

        const createMovie = async (title) => {
            const response = await request('/movies', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ title, genre: 'Drame', year: 2020 })
            });
            assert.equal(response.status, 201);
            return response.json();
        };

        const zulu = await createMovie('Zulu');
        const alpha = await createMovie('  Alpha  ');
        assert.equal(alpha.title, 'Alpha');
        assert.equal(alpha.rating, null);

        const listResponse = await request('/movies');
        assert.deepEqual(
            (await listResponse.json()).map((movie) => movie.title),
            ['Alpha', 'Zulu']
        );

        const filteredResponse = await request('/movies?genre=Drame');
        assert.equal((await filteredResponse.json()).length, 2);

        const invalidGenreResponse = await request('/movies?genre=Inconnu');
        assert.equal(invalidGenreResponse.status, 400);

        const missingMovieResponse = await request('/movies/999', {
            method: 'PATCH',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ rating: 6 })
        });
        assert.equal(missingMovieResponse.status, 404);

        const invalidRatingResponse = await request(`/movies/${alpha.id}`, {
            method: 'PATCH',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ rating: 6 })
        });
        assert.equal(invalidRatingResponse.status, 400);

        const updateResponse = await request(`/movies/${alpha.id}`, {
            method: 'PATCH',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ rating: 5 })
        });
        assert.equal(updateResponse.status, 200);
        assert.equal((await updateResponse.json()).rating, 5);

        const deleteResponse = await request(`/movies/${zulu.id}`, { method: 'DELETE' });
        assert.equal(deleteResponse.status, 204);

        const missingDeleteResponse = await request('/movies/not-an-id', { method: 'DELETE' });
        assert.equal(missingDeleteResponse.status, 404);
    } finally {
        await new Promise((resolve, reject) => {
            server.close((error) => (error ? reject(error) : resolve()));
        });
        db.close();
    }
});

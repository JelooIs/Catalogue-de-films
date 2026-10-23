function createMovieController(movieService) {
    return {
        getGenres(req, res) {
            res.status(200).json(movieService.getGenres());
        },

        listMovies(req, res) {
            res.status(200).json(movieService.listMovies(req.query.genre));
        },

        createMovie(req, res) {
            res.status(201).json(movieService.createMovie(req.body || {}));
        },

        updateMovieRating(req, res) {
            const id = Number(req.params.id);
            const { rating } = req.body || {};
            res.status(200).json(movieService.updateMovieRating(id, rating));
        },

        deleteMovie(req, res) {
            const id = Number(req.params.id);
            movieService.deleteMovie(id);
            res.status(204).end();
        }
    };
}

module.exports = createMovieController;

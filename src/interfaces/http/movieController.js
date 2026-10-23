function createMovieController(movieService) {
    return {
        listGenres(req, res) {
            res.status(200).json(movieService.listGenres());
        },

        listMovies(req, res) {
            res.status(200).json(movieService.listMovies(req.query.genre));
        },

        createMovie(req, res) {
            res.status(201).json(movieService.createMovie(req.body));
        },

        addRating(req, res) {
            const id = Number(req.params.id);
            const movie = movieService.addRating(id, req.body);
            res.status(200).json(movie);
        },

        deleteMovie(req, res) {
            const id = Number(req.params.id);
            movieService.deleteMovie(id);
            res.status(204).end();
        }
    };
}

module.exports = createMovieController;

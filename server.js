const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

const GENRES = ['Action', 'Animation', 'Comédie', 'Drame', 'Fantastique', 'Horreur', 'Science-fiction', 'Thriller'];

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// la verfication et validation des données
const isInt = (v) => typeof v === 'number' && Number.isInteger(v);

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
    if (!isInt(year) || year < 1888 || year > max) {
        return `L'année doit être un entier entre 1888 et ${max}.`;
    }
    return null;
}

function validateRating(rating) {
    if (!isInt(rating) || rating < 1 || rating > 5) {
        return 'Faut que la note soit un entier entre 1 et 5.';
    }
    return null;
}

const SELECT_MOVIES = `
    SELECT movies.id, movies.title, movies.genre, movies.year, movies.created_at,
           ROUND(AVG(ratings.value), 1) AS rating,
           COUNT(ratings.id) AS ratings_count
    FROM movies
    LEFT JOIN ratings ON ratings.movie_id = movies.id
`;


function getMovie(id) {
    return db.prepare(`${SELECT_MOVIES} WHERE movies.id = ? GROUP BY movies.id`).get(id);
}

// la route 
app.get('/api/genres', (req, res) => {
    res.status(200).json(GENRES);
});

//  
app.get('/api/movies', (req, res) => {
     const { genre } = req.query;

     if (genre !== undefined ) {
        const err = validateGenre(genre);
        if (err) return res.status(400).json({ error: err });
       
        const movies = db.prepare(`${SELECT_MOVIES} WHERE movies.genre = ? GROUP BY movies.id ORDER BY movies.title COLLATE NOCASE`).all(genre);
        return res.status(200).json(movies);
     }

    
     const movies = db.prepare(`${SELECT_MOVIES} GROUP BY movies.id ORDER BY movies.title COLLATE NOCASE`).all();
     res.status(200).json(movies);
});

// 
app.post('/api/movies', (req, res) => {
    const { title, genre, year } = req.body || {};

    const err = validateTitle(title) || validateGenre(genre) || validateYear(year);
    if (err) return res.status(400).json({ error: err });

    const result = db.prepare('INSERT INTO movies (title, genre, year) VALUES (?, ?, ?)').run(title.trim(), genre, year);

  
    const movie = getMovie(result.lastInsertRowid);
    res.status(201).json(movie);
});

//
app.patch('/api/movies/:id', (req, res) => {
    const id = Number(req.params.id);
   
    const movie = Number.isInteger(id) ? getMovie(id) : undefined;
    if (!movie) return res.status(404).json({ error: 'Film introuvable.' });

    const { rating } = req.body || {};
    const err = validateRating(rating);
    if (err) return res.status(400).json({ error: err });

  
    db.prepare('INSERT INTO ratings (movie_id, value) VALUES (?, ?)').run(id, rating);

 
    const update = getMovie(id);
    res.status(200).json(update);
});


app.delete('/api/movies/:id', (req, res) => {
    const id = Number(req.params.id);
    const result = Number.isInteger(id) ? db.prepare('DELETE FROM movies WHERE id = ?').run(id) : { changes: 0 };
    if (result.changes === 0 ) {
        return res.status(404).json({ error: 'Film introuvable.' });
    }
    res.status(204).end();
}); 

//
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Requête JSON invalide.' });
  }
  console.error(err);
  res.status(500).json({ error: 'Erreur interne du serveur.' });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
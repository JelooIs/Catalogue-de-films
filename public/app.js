// URL de base de l'API, pour éviter de la répéter dans chaque fetch
const API_BASE = "http://localhost:3000/api";

// Construit le HTML des 5 boutons étoile pour un film, en remplissant
// celles inférieures ou égales à la note (rating) du film
function renderStarButtons(movieId, rating) {
  let buttons = "";
  for (let i = 1; i <= 5; i++) {
    const filled = rating !== null && i <= rating ? "is-filled" : "";
    buttons += `<button type="button" class="star-button ${filled}" data-id="${movieId}" data-value="${i}">★</button>`;
  }
  return buttons;
}

// Remplissage dynamique des <select> de genre (filtre + formulaire d'ajout)
// à partir de la liste des genres renvoyée par l'API
async function chargerGenres() {
  try {
    const res = await fetch(`${API_BASE}/genres`);
    const genres = await res.json();
    const selects = document.querySelectorAll("#genre-filter, #genre");
    selects.forEach((select) => {
      genres.forEach((genre) => {
        select.innerHTML += `<option value="${genre}">${genre}</option>`;
      });
    });
  } catch (error) {
    console.error("Erreur lors du chargement des genres :", error);
  }
}

chargerGenres();

// Élément <select> du filtre par genre, réutilisé partout où on a besoin
// de connaître/relire le genre actuellement sélectionné
const select = document.querySelector("#genre-filter");

// Affiche la liste des films, filtrée par genre si fourni
async function afficherFilms(genre) {
  const url = genre
    ? `${API_BASE}/movies?genre=${genre}`
    : `${API_BASE}/movies`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const divListeFilm = document.querySelector("#movie-list");
    divListeFilm.innerHTML = "";
    data.forEach((film) => {
      divListeFilm.innerHTML += `
        <div class="movie-card" data-id="${film.id}">
          <div class="card-top">
            <span class="genre-tag">${film.genre}</span>
            <button type="button" class="delete-button" data-id="${film.id}" aria-label="Supprimer">
              <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
          </div>
          <h3>${film.title}</h3>
          <p class="movie-year">sortie en ${film.year}</p>
          <div class="rating">
            <span class="rating-stars">${renderStarButtons(film.id, film.rating)}</span>
            ${film.rating !== null ? `<span class="rating-value">${film.rating}/5</span>` : ""}
          </div>
        </div>`;
    });
    document.querySelector(".summary-badge").textContent = `${data.length} films`;
  } catch (error) {
    console.error("Erreur lors du chargement des films :", error);
  }
}

// Affichage initial : tous les films, sans filtre
afficherFilms("");

// Relance l'affichage filtré quand on change de genre
select.addEventListener("change", (e) => {
  afficherFilms(e.target.value);
});

// Ajout d'un film via le formulaire
const form = document.querySelector("#movie-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.querySelector("#title").value;
  const genre = document.querySelector("#genre").value;
  const year = Number(document.querySelector("#year").value);
  const message = document.querySelector("#form-message");

  try {
    const res = await fetch(`${API_BASE}/movies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, genre, year }),
    });
    const data = await res.json();

    if (res.ok) {
      message.textContent = "Film ajouté avec succès ! ";
      form.reset();
      afficherFilms(select.value);
    } else {
      message.textContent = data.error;
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout du film :", error);
    message.textContent = "Une erreur est survenue, veuillez réessayer.";
  }
});

// Gestion des clics dans la liste des films : notation (étoiles) et suppression
const movieList = document.querySelector("#movie-list");

movieList.addEventListener("click", async (e) => {
  const starButton = e.target.closest(".star-button");
  if (starButton) {
    const id = starButton.dataset.id;
    const rating = Number(starButton.dataset.value);
    try {
      await fetch(`${API_BASE}/movies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });
      afficherFilms(select.value);
    } catch (error) {
      console.error("Erreur lors de la notation du film :", error);
    }
    return;
  }

  const deleteButton = e.target.closest(".delete-button");
  if (deleteButton) {
    const id = deleteButton.dataset.id;
    try {
      await fetch(`${API_BASE}/movies/${id}`, {
        method: "DELETE",
      });
      afficherFilms(select.value);
    } catch (error) {
      console.error("Erreur lors de la suppression du film :", error);
    }
  }
});

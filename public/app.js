function renderStarButtons(movieId, rating) {
  let buttons = "";
  for (let i = 1; i <= 5; i++) {
    const filled = rating !== null && i <= rating ? "is-filled" : "";
    buttons += `<button type="button" class="star-button ${filled}" data-id="${movieId}" data-value="${i}">★</button>`;
  }
  return buttons;
}

fetch("http://localhost:3000/api/genres")
  .then((res) => res.json())
  .then((genres) => {
    const selects = document.querySelectorAll("#genre-filter, #genre");
    selects.forEach((select) => {
      genres.forEach((genre) => {
        select.innerHTML += `<option value="${genre}">${genre}</option>`;
      });
    });
  });

const select = document.querySelector("#genre-filter");

function afficherFilms(genre) {
  const url = genre
    ? `http://localhost:3000/api/movies?genre=${genre}`
    : `http://localhost:3000/api/movies`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
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
    });
}

afficherFilms("");

select.addEventListener("change", (e) => {
  afficherFilms(e.target.value);
});

const form = document.querySelector("#movie-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.querySelector("#title").value;
  const genre = document.querySelector("#genre").value;
  const year = Number(document.querySelector("#year").value);

  fetch("http://localhost:3000/api/movies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, genre, year }),
  })
    .then((res) => {
      return res.json().then((data) => ({ ok: res.ok, data }));
    })
    .then(({ ok, data }) => {
      const message = document.querySelector("#form-message");
      if (ok) {
        message.textContent = "Film ajouté avec succès ! ";
        form.reset();
        afficherFilms(select.value);
      } else {
        message.textContent = data.error;
      }
    });
});

const movieList = document.querySelector("#movie-list");

movieList.addEventListener("click", (e) => {
  const starButton = e.target.closest(".star-button");
  if (starButton) {
    const id = starButton.dataset.id;
    const rating = Number(starButton.dataset.value);
    fetch(`http://localhost:3000/api/movies/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating }),
    }).then(() => afficherFilms(select.value));
    return;
  }

  const deleteButton = e.target.closest(".delete-button");
  if (deleteButton) {
    const id = deleteButton.dataset.id;
    fetch(`http://localhost:3000/api/movies/${id}`, {
      method: "DELETE",
    }).then(() => afficherFilms(select.value));
  }
});

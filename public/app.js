function renderStars(rating) {
  let stars = "";
  if(rating !== null){
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating ? "★" : "☆";
  }
}
else stars = "Aucune note"
  return stars;
}

fetch("http://localhost:3000/api/genres")
  .then((res) => res.json())
  .then((genres) => {
    const selects = document.querySelectorAll("#genre-filter, #genre");
    selects.forEach((select)=> {
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
        <div class="movie-card">
        <div class="card-top">
        <span class="genre-tag">${film.genre}</span>
        </div>
        <h3>${film.title}</h3>
        <p class="movie-year">sortie en ${film.year}</p>
        <div class="rating">
        <span class="rating-stars">${renderStars(film.rating)}</span>
        ${film.rating !== null ? `<span class="rating-value">${film.rating}/5</span>` : ""}
        </div>
    </div>`;
      });
    });
};

afficherFilms("");

select.addEventListener("change", (e) => {
    afficherFilms(e.target.value);
})

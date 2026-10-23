function renderStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating ? "★" : "☆";
  }
  return stars;
}

fetch("http://localhost:3000/api/genres")
  .then((res) => res.json())
  .then((genres) => {
    const select = document.querySelector("#genre-filter");
    genres.forEach((genre) => {
      select.innerHTML += `<option value="${genre}">${genre}</option>`;
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
        <div>
        <h3>${film.title}</h3>
        <p>genre: <strong>${film.genre}</strong></p>
        <p>sortie en <strong>${film.year}</strong></p>
        <p>note: ${renderStars(film.rating)}</p>
    </div>`;
      });
    });
};

afficherFilms("");

select.addEventListener("change", (e) => {
    afficherFilms(e.target.value);
})

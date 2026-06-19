const API_KEY = "AYN66JD-1554XPN-J61W6R6-JVE2GVK";
const API_URL = "https://api.poiskkino.dev/v1.4/movie";

async function fetchMovies(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
      },
    });

    const data = await response.json();
    console.log(data);
    displayMovies(data);
  } catch (error) {
    console.log(error);
  }
}

fetchMovies(API_URL);

function displayMovies(movies) {
  const catalogGrid = document.querySelector(".catalog__grid");

  movies.docs.forEach((movie) => {
    const rating = movie.rating?.imdb ?? 8;
    const articleEl = document.createElement("article");

    articleEl.innerHTML = `
    <img
    class="catalog__image"
    src="/photo/Карточка фильма.png"
    alt="Фото карточки фильма"
  />
  <div class="catalog-card__body">
    <div class="catalog-card__info">
      <h3 class="card__title">${movie.alternativeName}</h3>
      <p class="card__year">${movie.year}г.</p>
    </div>
    <span class="card__rating">${rating}/10</span>
  </div>
    `;
    catalogGrid.append(articleEl);
  });
}

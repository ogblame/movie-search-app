const API_KEY = "AYN66JD-1554XPN-J61W6R6-JVE2GVK";
const API_URL = "https://api.poiskkino.dev/v1.4/movie?limit=250";

let moviesData = [];
let currentTab = "popularMovies";

const catalogHeader = document.querySelector(".catalog__header");
let index = 0;
const tabButtons = document.querySelectorAll(".catalog__tab");
tabButtons[index].classList.add("btn-active");

const inputFilterHeader = document.getElementById("input-header");

inputFilterHeader.addEventListener("input", (event) => {
  const searchValue = event.target.value.toLowerCase();

  const filteredMovies = moviesData.filter((movie) => {
    return movie.alternativeName.toLowerCase().includes(searchValue);
  });

  displayMovies(filteredMovies);
});

catalogHeader.addEventListener("click", (event) => {
  const clickedTab = event.target.dataset.type;

  if (clickedTab === "series") {
    currentTab = "series";
    tabButtons.forEach((button) => button.classList.remove("btn-active"));
    event.target.classList.add("btn-active");
    const series = moviesData
      .filter((movie) => movie.type === "tv-series")
      .sort((a, b) => a.ageRating - b.ageRating);
    displayMovies(series);
  }

  if (clickedTab === "popularMovies") {
    currentTab = "popularMovies";
    tabButtons.forEach((button) => button.classList.remove("btn-active"));
    event.target.classList.add("btn-active");
    popularFilms(moviesData);
  }

  if (clickedTab === "movies") {
    currentTab = "movies";
    tabButtons.forEach((button) => button.classList.remove("btn-active"));
    event.target.classList.add("btn-active");
    const filteredMovies = moviesData.filter((movie) => movie.type === "movie");
    displayMovies(filteredMovies);
  }
});

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

    moviesData = data.docs.filter((movie) => movie.poster);
    console.log(moviesData);

    popularFilms(moviesData);
  } catch (error) {
    console.log(error);
  }
}

fetchMovies(API_URL);

function popularFilms(movies) {
  const popularFilms = moviesData
    .filter((movie) => movie.type === "movie")
    .sort((a, b) => a.ageRating - b.ageRating);
  displayMovies(popularFilms);
}

function displayMovies(movies) {
  const catalogGrid = document.querySelector(".catalog__grid");
  const catalogFilter = document.querySelector(".catalog__filter-grid");
  catalogGrid.innerHTML = "";
  catalogFilter.innerHTML = "";
  const slicedMovies = movies.slice(0, 15);

  slicedMovies.forEach((movie, index) => {
    const rating = movie.rating?.imdb ?? 8;
    const year = movie?.year ?? "1997";
    const poster = movie.poster?.previewUrl ?? "/photo/Карточка фильма.png";

    const articleEl = document.createElement("article");
    articleEl.innerHTML = `
    <img
    class="catalog__image"
    src="${poster}"
    alt="Фото карточки фильма"
  />
  <div class="catalog-card__body">
    <div class="catalog-card__info">
      <h3 class="card__title">${movie.alternativeName}</h3>
      <p class="card__year">${year}г.</p>
    </div>
    <span class="card__rating">${rating}/10</span>
  </div>
    `;

    if (index <= 9) {
      catalogGrid.append(articleEl);
    } else {
      catalogFilter.append(articleEl);
    }
  });
}

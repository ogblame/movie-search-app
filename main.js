const API_KEY = "AYN66JD-1554XPN-J61W6R6-JVE2GVK";
const API_URL = "https://api.poiskkino.dev/v1.4/movie?limit=250";

let moviesData = [];
let currentTab = "popularMovies";
let searchValue = "";

const catalogHeader = document.querySelector(".catalog__header");
const tabButtons = document.querySelectorAll(".catalog__tab");
const input = document.getElementById("input-header");
const firstTabButton = document.querySelectorAll(".catalog__tab")[0];
firstTabButton.classList.add("btn-active");

const selects = document.querySelectorAll(".catalog__filter-tab");

input.addEventListener("input", (event) => {
  searchValue = event.target.value.toLowerCase();
  renderCatalog();
});

catalogHeader.addEventListener("click", (event) => {
  const clickedButton = event.target.closest(".catalog__tab");

  if (clickedButton) {
    tabButtons.forEach((button) => button.classList.remove("btn-active"));
    clickedButton.classList.add("btn-active");

    const clickedTab = clickedButton.dataset.type;

    if (clickedTab === "series") {
      currentTab = "series";
    }

    if (clickedTab === "popularMovies") {
      currentTab = "popularMovies";
    }

    if (clickedTab === "movie") {
      currentTab = "movie";
    }
    renderCatalog();
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
    renderCatalog();
    console.log(moviesData);
    selectsFilter(moviesData);
  } catch (error) {
    console.log(error);
  }
}

fetchMovies(API_URL);

function renderCatalog() {
  let result = [...moviesData];

  if (currentTab === "popularMovies") {
    result = result
      .filter((movie) => movie.type === "movie")
      .sort((a, b) => a.ageRating - b.ageRating);
  } else if (currentTab === "series") {
    result = result
      .filter((movie) => movie.type === "tv-series")
      .sort((a, b) => a.ageRating - b.ageRating);
  } else if (currentTab === "movie") {
    result = result.filter((movie) => movie.type === "movie");
  }

  if (searchValue) {
    result = result.filter((movie) => {
      return movie.alternativeName.toLowerCase().includes(searchValue);
    });
  }

  displayMovies(result);
}

function selectsFilter(moviesData) {
  const years = [
    ...new Set(
      moviesData
        .map((movie) => (movie.year === undefined ? 1999 : movie.year))
        .sort((a, b) => a - b),
    ),
  ];

  const genres = [
    ...new Set(
      moviesData.flatMap((movie) => movie.genres).map((movie) => movie.name),
    ),
  ];

  const countries = [
    ...new Set(
      moviesData.flatMap((movie) => movie.countries).map((movie) => movie.name),
    ),
  ];

  const rating = [
    ...new Set(
      moviesData
        .map((movie) => (movie.ageRating ? movie.ageRating : 5))
        .sort((a, b) => a - b),
    ),
  ];

  selects.forEach((select) => {
    if (select.dataset.filter === "year") {
      years.forEach((year) => {
        const option = document.createElement("option");
        option.classList.add("catalog__select");
        option.value = year;
        option.textContent = year;
        select.appendChild(option);
      });
    }

    if (select.dataset.filter === "genre") {
      genres.forEach((genre) => {
        const option = document.createElement("option");
        option.classList.add("catalog__select");
        option.value = genre;
        option.textContent = genre;
        select.appendChild(option);
      });
    }

    if (select.dataset.filter === "country") {
      countries.forEach((country) => {
        const option = document.createElement("option");
        option.classList.add("catalog__select");
        option.value = country;
        option.textContent = country;
        select.appendChild(option);
      });
    }

    if (select.dataset.filter === "rating") {
      rating.forEach((rat) => {
        const option = document.createElement("option");
        option.classList.add("catalog__select");
        option.value = rat;
        option.textContent = rat;
        select.appendChild(option);
      });
    }
  });
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

const API_KEY = "AYN66JD-1554XPN-J61W6R6-JVE2GVK";
const API_URL = "https://api.poiskkino.dev/v1.4/movie?limit=250";

let moviesData = [];
let currentTab = "popularMovies";
let searchValue = "";

let selectedFilters = {
  year: "",
  genre: "",
  country: "",
  rating: "",
};

const catalogHeader = document.querySelector(".catalog__header");
const tabButtons = document.querySelectorAll(".catalog__tab");
const input = document.getElementById("input-header");
const firstTabButton = document.querySelectorAll(".catalog__tab")[0];
firstTabButton.classList.add("btn-active");

const selects = document.querySelectorAll(".catalog__filter-tab");

const catalog = document.querySelectorAll(".catalog");

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");

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

function errorMessage(message) {
  catalog.forEach((item) => {
    item.innerHTML = `Ошибка API: ${message}`;
  });
}

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

    if (!response.ok) {
      throw new Error(`Ошибка API ${response.status}`);
      errorMessage;
    }

    const data = await response.json();

    moviesData = data.docs.filter((movie) => movie.poster);
    renderCatalog();
    selectsFilter(moviesData);
  } catch (error) {
    console.log(error);
    errorMessage(error);
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
    console.log("movie");
    result = result
      .filter((movie) => movie.type === "movie")
      .sort((a, b) => Math.random() - 0.5);
  }

  const sectionHero = document.querySelector(".hero");
  const catalog = document.querySelector(".catalog");

  if (searchValue) {
    sectionHero.style.display = "none";
    catalog.style.marginTop = "0px";

    result = result.filter((movie) => {
      return movie.alternativeName.toLowerCase().includes(searchValue);
    });
  } else {
    sectionHero.style.display = "block";
    catalog.style.marginTop = "60px";
  }

  if (selectedFilters.year) {
    result = result.filter(
      (movie) => movie.year === Number(selectedFilters.year),
    );
  }

  if (selectedFilters.rating) {
    result = result.filter(
      (movie) => movie.ageRating === Number(selectedFilters.rating),
    );
  }

  if (selectedFilters.country) {
    result = result.filter((movie) => {
      return movie.countries.some((country) => {
        return country.name === selectedFilters.country;
      });
    });
  }

  if (selectedFilters.genre) {
    result = result.filter((movie) => {
      return movie.genres.some((genre) => {
        return genre.name === selectedFilters.genre;
      });
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

  selects.forEach((select) => {
    select.addEventListener("change", (event) => {
      if (event.target.value === "Все") {
        selectedFilters[event.target.dataset.filter] = "";
      } else {
        selectedFilters[event.target.dataset.filter] = event.target.value;
      }
      renderCatalog();
    });
  });
}
function displayMovies(movies) {
  const catalogGrid = document.querySelector(".catalog__grid");
  const catalogFilter = document.querySelector(".catalog__filter-grid");
  catalogGrid.innerHTML = "";
  catalogFilter.innerHTML = "";
  const slicedMovies = movies.slice(0, 20);

  if (movies.length === 0) {
    catalogGrid.innerHTML = "Фильмы не найдены";
    catalogFilter.innerHTML = "Фильмы не найдены";
  }

  slicedMovies.forEach((movie, index) => {
    const rating = movie.rating?.imdb ?? 8;
    const year = movie?.year ?? "1997";
    const poster = movie.poster?.previewUrl ?? "/photo/Карточка фильма.png";

    const articleEl = document.createElement("article");
    articleEl.classList.add("catalog-card");
    articleEl.dataset.id = `${movie.id}`;
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

catalog.forEach((catalogItem) =>
  catalogItem.addEventListener("click", (event) => {
    const card = event.target.closest("article");
    if (!card) return;
    const idCard = Number(card.dataset.id);
    const movie = moviesData.find((movie) => movie.id === idCard);
    console.log(movie);
    openModal(movie);
  }),
);

function openModal(movie) {
  let genres = movie.genres.flatMap((genre) => genre.name);
  if (genres.length > 2) {
    genres.length = 2;
  }
  genres = genres.join(", ");
  console.log(genres);
  const countries = movie.countries.flatMap((country) => country.name);
  const poster = movie.poster?.previewUrl ?? "/photo/Карточка фильма.png";
  const description = movie.description ?? "Описание отсутствует";
  const rating = movie.ageRating ?? "12";
  const year = movie.year ?? "1821";

  modalBody.innerHTML = `

  <div>
    <img
      src="${poster}"
      alt="Фото карточки фильма">
  </div>

  <div class="modal-window">
    <div class="modal_main">
      <h3 class="title-modal">${movie.alternativeName}</h3>
      <span class="rating-modal">Рейтинг: ${rating}</span>
    </div>

    <div class="modal_decsription">
      <p><strong style="font-weight: bold;">Описание фильма:</strong> </br>${description}</p>
    </div>

    <div class="modal-info-block">

    <h4 style="font-weight: bold;">О фильме</h4>

    <dl class="modal-info">

        <div class="movie-info__row">
          <dt>Жанр</dt>
          <dd>${genres}</dd>
      </div>

       <div class="movie-info__row">
          <dt>Страна</dt>
          <dd>${countries}</dd>
      </div>

       <div class="movie-info__row">
          <dt>Год</dt>
          <dd>${year}</dd>
      </div>

    </dl>

    </div>
    
  </div>

  
  `;

  modal.style.display = "block";
}

const closeModal = document.getElementById("closeModal");

closeModal.addEventListener("click", (event) => {
  console.log(event.target);
  modal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

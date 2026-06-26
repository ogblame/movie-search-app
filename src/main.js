import { fetchMovies } from "./api.js";
import { openModal } from "./modal.js";
import { getYears, getGenres, getCountries, getRatings } from "./filters.js";
import { displayMovies } from "./render.js";

let moviesData = [];
let currentTab = "popularMovies";
let searchValue = "";

let selectedFilters = {
  year: "",
  genre: "",
  country: "",
  rating: "",
};

async function initApp() {
  try {
    moviesData = await fetchMovies();
    renderCatalog();
    selectsFilter(moviesData);
  } catch (error) {
    errorMessage(error);
  }
}

initApp();

function errorMessage(message) {
  catalog.forEach((item) => {
    item.innerHTML = `Ошибка API: ${message}`;
  });
}

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
  const years = getYears(moviesData);
  const genres = getGenres(moviesData);
  const countries = getCountries(moviesData);
  const rating = getRatings(moviesData);

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

catalog.forEach((catalogItem) =>
  catalogItem.addEventListener("click", (event) => {
    const card = event.target.closest("article");
    if (!card) return;
    const idCard = Number(card.dataset.id);
    const movie = moviesData.find((movie) => movie.id === idCard);
    openModal(movie);
  }),
);

const closeModal = document.getElementById("closeModal");

closeModal.addEventListener("click", (event) => {
  modal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

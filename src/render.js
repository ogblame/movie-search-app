export function displayMovies(movies) {
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

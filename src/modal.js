export function openModal(movie) {
  let genres = movie.genres.flatMap((genre) => genre.name);
  if (genres.length > 2) {
    genres.length = 2;
  }
  genres = genres.join(", ");
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

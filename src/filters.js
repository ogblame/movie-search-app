export function getYears(movies) {
  return [
    ...new Set(
      movies
        .map((movie) => (movie.year === undefined ? 1999 : movie.year))
        .sort((a, b) => a - b),
    ),
  ];
}

export function getGenres(movies) {
  return [
    ...new Set(
      movies.flatMap((movie) => movie.genres).map((movie) => movie.name),
    ),
  ];
}

export function getCountries(movies) {
  return [
    ...new Set(
      movies.flatMap((movie) => movie.countries).map((movie) => movie.name),
    ),
  ];
}

export function getRatings(movies) {
  return [
    ...new Set(
      movies
        .map((movie) => (movie.ageRating ? movie.ageRating : 5))
        .sort((a, b) => a - b),
    ),
  ];
}

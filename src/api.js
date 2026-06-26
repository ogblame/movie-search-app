const API_KEY = "AYN66JD-1554XPN-J61W6R6-JVE2GVK";
const API_URL = "https://api.poiskkino.dev/v1.4/movie?limit=250";

export async function fetchMovies() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка API ${response.status}`);
    }

    const data = await response.json();

    const newData = data.docs.filter((movie) => movie.poster);

    return newData;
  } catch (error) {
    throw error;
  }
}

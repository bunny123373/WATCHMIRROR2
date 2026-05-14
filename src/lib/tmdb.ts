const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";

export async function tmdbFetch(endpoint: string) {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB_API_KEY is not defined");
  }
  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${TMDB_BASE}${endpoint}${separator}api_key=${TMDB_API_KEY}`;
  const res = await fetch(url, {
    headers: { accept: "application/json" },
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`TMDB API error: ${res.status} ${text.slice(0, 200)}`);
  }
  return res.json();
}

export async function searchMulti(query: string) {
  return tmdbFetch(`/search/multi?query=${encodeURIComponent(query)}`);
}

export async function getMovieDetails(id: number) {
  return tmdbFetch(`/movie/${id}?append_to_response=credits,videos`);
}

export async function getTvDetails(id: number) {
  return tmdbFetch(`/tv/${id}?append_to_response=credits,videos`);
}

export async function getSimilarMovies(id: number) {
  return tmdbFetch(`/movie/${id}/similar`);
}

export async function getSimilarTv(id: number) {
  return tmdbFetch(`/tv/${id}/similar`);
}

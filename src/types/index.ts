export interface Cast {
  name: string;
  character: string;
  profileImage: string;
}

export interface Episode {
  episodeNumber: number;
  episodeTitle: string;
  hlsLink?: string;
  embedIframeLink?: string;
  peachifyId?: string;
  downloadLink?: string;
  quality: string;
}

export interface Season {
  seasonNumber: number;
  episodes: Episode[];
}

export interface ContentStream {
  language: string;
  hlsLink: string;
  embedIframeLink: string;
  subtitles?: { language: string; url: string }[];
}

export interface IContent {
  _id?: string;
  type: "movie" | "series";
  title: string;
  slug: string;
  poster: string;
  banner: string;
  description: string;
  year: number;
  language: string;
  dubLanguage: string[];
  audioAvailable: string[];
  category: string;
  quality: string;
  rating: number;
  tags: string[];
  popularity: number;
  contentRating?: string;
  trailerEmbedUrl?: string;
  cast: Cast[];
  metaTitle: string;
  metaDescription: string;
  tmdbId?: number;
  hlsLink?: string;
  embedIframeLink?: string;
  peachifyId?: string;
  downloadLink?: string;
  streams?: ContentStream[];
  seasons?: Season[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContinueWatchingItem {
  slug: string;
  type: "movie" | "series";
  title: string;
  poster: string;
  currentTime: number;
  duration: number;
  seasonNumber?: number;
  episodeNumber?: number;
  updatedAt: number;
}

export interface TmdbMovieResult {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  popularity: number;
  genre_ids: number[];
  media_type: string;
}

export interface TmdbTvResult {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  popularity: number;
  genre_ids: number[];
  media_type: string;
}

export interface TmdbDetails {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  popularity: number;
  genres: { id: number; name: string }[];
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string;
      order: number;
    }[];
  };
  videos?: {
    results: {
      key: string;
      site: string;
      type: string;
    }[];
  };
  number_of_seasons?: number;
  seasons?: {
    season_number: number;
    name: string;
    episode_count: number;
  }[];
}

export type SearchResult = TmdbMovieResult | TmdbTvResult;

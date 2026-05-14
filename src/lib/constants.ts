export const SITE_NAME = "WATCHMIRROR";
export const SITE_TAGLINE = "Stream Without Limits.";
export const SITE_URL = "https://watchmirror.vercel.app";

export const THEME = {
  background: "#050608",
  card: "#0E1015",
  border: "#1F232D",
  primary: "#F5C542",
  secondary: "#8B5CF6",
  accent: "#22C55E",
  text: "#F9FAFB",
  muted: "#9CA3AF",
} as const;

export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/original";
export const TMDB_IMAGE_W500 = "https://image.tmdb.org/t/p/w500";

export const GENRE_MAP: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western",
  10759: "Action & Adventure", 10762: "Kids", 10763: "News",
  10764: "Reality", 10765: "Sci-Fi & Fantasy", 10766: "Soap",
  10767: "Talk", 10768: "War & Politics",
};

export const LANGUAGES = [
  "English", "Hindi", "Spanish", "French", "Korean",
  "Japanese", "Chinese", "German", "Italian", "Portuguese",
  "Russian", "Arabic", "Turkish", "Tamil", "Telugu",
  "Bengali", "Punjabi", "Marathi", "Gujarati", "Malayalam",
  "Kannada", "Urdu", "Thai", "Vietnamese", "Dutch",
  "Polish", "Swedish", "Greek", "Persian", "Hebrew",
  "Indonesian", "Filipino", "Mandarin", "Cantonese", "Romanian",
  "Hungarian", "Czech", "Ukrainian", "Danish", "Norwegian",
  "Finnish", "Odia", "Assamese", "Nepali", "Sinhala",
];

export const LANGUAGES_GROUPED = [
  {
    label: "Indian Languages",
    languages: ["Hindi", "Tamil", "Telugu", "Bengali", "Punjabi", "Marathi", "Gujarati", "Malayalam", "Kannada", "Urdu", "Odia", "Assamese", "Nepali", "Sinhala"],
  },
  {
    label: "Asian Languages",
    languages: ["Korean", "Japanese", "Mandarin", "Cantonese", "Thai", "Vietnamese", "Indonesian", "Filipino"],
  },
  {
    label: "European Languages",
    languages: ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Russian", "Dutch", "Polish", "Swedish", "Greek", "Romanian", "Hungarian", "Czech", "Ukrainian", "Danish", "Norwegian", "Finnish"],
  },
  {
    label: "Middle Eastern Languages",
    languages: ["Arabic", "Turkish", "Persian", "Hebrew"],
  },
];

export const CATEGORIES = [
  "Action", "Adventure", "Animation", "Comedy", "Crime",
  "Documentary", "Drama", "Family", "Fantasy", "History",
  "Horror", "Music", "Mystery", "Romance", "Sci-Fi",
  "Thriller", "War", "Western", "Kids", "Reality",
];

export const QUALITIES = ["4K", "1080p", "720p", "480p", "360p"];

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

export const CONTENT_RATINGS = [
  { value: "G", label: "G — General Audiences" },
  { value: "PG", label: "PG — Parental Guidance Suggested" },
  { value: "PG-13", label: "PG-13 — Parents Strongly Cautioned" },
  { value: "R", label: "R — Restricted" },
  { value: "NC-17", label: "NC-17 — Adults Only" },
  { value: "TV-Y", label: "TV-Y — All Children" },
  { value: "TV-Y7", label: "TV-Y7 — Older Children" },
  { value: "TV-G", label: "TV-G — General Audience" },
  { value: "TV-PG", label: "TV-PG — Parental Guidance" },
  { value: "TV-14", label: "TV-14 — Parents Strongly Cautioned" },
  { value: "TV-MA", label: "TV-MA — Mature Audience Only" },
  { value: "U/A 7+", label: "U/A 7+ — Parental Guidance for <7" },
  { value: "U/A 13+", label: "U/A 13+ — Parental Guidance for <13" },
  { value: "U/A 16+", label: "U/A 16+ — Parental Guidance for <16" },
  { value: "A", label: "A — Adult Only (18+)" },
];

export const MATURITY_LEVELS = [
  { value: "all", label: "All Ratings" },
  { value: "G", label: "General (G)" },
  { value: "PG", label: "Parental Guidance (PG)" },
  { value: "PG-13", label: "Teens (PG-13)" },
  { value: "R", label: "Mature (R)" },
  { value: "NC-17", label: "Adult Only (NC-17)" },
];

export const RATING_HIERARCHY: Record<string, number> = {
  "TV-Y": 0,
  "TV-Y7": 0,
  "G": 0,
  "TV-G": 0,
  "U/A 7+": 1,
  "PG": 1,
  "TV-PG": 1,
  "PG-13": 2,
  "TV-14": 2,
  "U/A 13+": 2,
  "R": 3,
  "U/A 16+": 3,
  "TV-MA": 3,
  "NC-17": 4,
  "A": 4,
};

export const RATING_COLORS: Record<string, string> = {
  "G": "#22C55E",
  "PG": "#3B82F6",
  "PG-13": "#F59E0B",
  "R": "#EF4444",
  "NC-17": "#DC2626",
  "TV-Y": "#22C55E",
  "TV-Y7": "#22C55E",
  "TV-G": "#22C55E",
  "TV-PG": "#3B82F6",
  "TV-14": "#F59E0B",
  "TV-MA": "#EF4444",
  "U/A 7+": "#3B82F6",
  "U/A 13+": "#F59E0B",
  "U/A 16+": "#EF4444",
  "A": "#DC2626",
};

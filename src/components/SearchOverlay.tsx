"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Search, X, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { RootState } from "@/store/store";
import { closeSearch, setQuery } from "@/store/slices/searchSlice";
import { TMDB_IMAGE_W500 } from "@/lib/constants";
import type { SearchResult } from "@/types";

export default function SearchOverlay() {
  const dispatch = useDispatch();
  const { isOpen, query } = useSelector((state: RootState) => state.search);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "movie" | "tv">("all");
  const [filterYear, setFilterYear] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => document.body.classList.remove("no-scroll");
  }, [isOpen]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const tmdbParams = new URLSearchParams({ query });
        if (filterType !== "all") tmdbParams.set("type", filterType === "tv" ? "tv" : "movie");
        if (filterYear) tmdbParams.set("year", filterYear);
        const profile = (localStorage.getItem("wm_profile") as "netflix" | "prime") || "netflix";
        const localParams = new URLSearchParams({
          search: query,
          limit: "10",
          primeVideo: profile === "prime" ? "true" : "false",
        });
        const [tmdbRes, localRes] = await Promise.all([
          fetch(`/api/tmdb/search?${tmdbParams}`),
          fetch(`/api/content?${localParams}`),
        ]);
        const tmdbData = await tmdbRes.json();
        const localData = await localRes.json();
        const localItems = (localData.items || []).map((item: any) => ({
          id: item.slug,
          title: item.title,
          name: item.title,
          poster_path: item.poster?.replace(/^https?:\/\/[^\/]+/, ""),
          media_type: item.type === "series" ? "tv" : item.type,
          release_date: item.year?.toString(),
          first_air_date: item.year?.toString(),
          vote_average: item.rating,
          primeVideo: item.primeVideo,
        }));
        const merged = [...(tmdbData.results || [])];
        for (const local of localItems) {
          if (!merged.some((m: any) => m.id === local.id)) {
            merged.push(local);
          }
        }
        setResults(merged);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, [query, filterType, filterYear]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch(closeSearch());
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [dispatch]);

  const getTitle = (r: SearchResult) => "title" in r ? r.title : "name" in r ? r.name : "";
  const getDate = (r: SearchResult) => "release_date" in r ? r.release_date : "first_air_date" in r ? r.first_air_date : "";
  const getLink = (r: any) => {
    if (r.primeVideo) {
      return r.media_type === "tv" ? `/prime-video/series/${r.id}` : `/prime-video/movie/${r.id}`;
    }
    return r.media_type === "tv" ? `/series/${r.id}` : `/movie/${r.id}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] md:z-[60] bg-[#050608]/95 backdrop-blur-xl"
        >
          <div className="max-w-2xl mx-auto px-4 pt-16 md:pt-24">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => dispatch(setQuery(e.target.value))}
                placeholder="Search movies & series..."
                className="w-full h-14 pl-12 pr-12 rounded-none bg-[#0E1015] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF] text-lg focus:outline-none focus:border-[#F5C542] transition-colors"
              />
              <button
                onClick={() => dispatch(closeSearch())}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-none hover:bg-[#1F232D] transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5 text-[#9CA3AF]" />
              </button>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <div className="flex gap-1">
                {(["all", "movie", "tv"] as const).map((t) => (
                  <button key={t} onClick={() => setFilterType(t)}
                    className={`px-3 py-1.5 rounded-none text-xs font-medium transition-all ${
                      filterType === t ? "bg-[#F5C542] text-[#050608]" : "bg-[#0E1015] text-[#9CA3AF] border border-[#1F232D] hover:border-[#F5C542]/50"
                    }`}>
                    {t === "all" ? "All" : t === "movie" ? "Movies" : "Series"}
                  </button>
                ))}
              </div>
              <input type="number" value={filterYear} onChange={(e) => setFilterYear(e.target.value)}
                placeholder="Year"
                className="w-20 h-8 px-2 rounded-none bg-[#0E1015] border border-[#1F232D] text-[#F9FAFB] text-xs placeholder-[#9CA3AF] focus:outline-none focus:border-[#F5C542] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            <div className="mt-4">
              {loading && (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-[#F5C542] animate-spin" />
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                  {results.map((result) => (
                    <Link
                      key={result.id}
                      href={getLink(result)}
                      onClick={() => dispatch(closeSearch())}
                      className="flex items-center gap-4 p-3 rounded-none bg-[#0E1015] border border-[#1F232D] hover:border-[#F5C542]/30 transition-all"
                    >
                      <div className="relative w-12 h-16 rounded-none overflow-hidden flex-shrink-0 bg-[#1F232D]">
                        {result.poster_path && (
                          <Image
                            src={result.poster_path.startsWith("http") ? result.poster_path : `${TMDB_IMAGE_W500}${result.poster_path}`}
                            alt={getTitle(result)}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#F9FAFB] truncate">
                          {getTitle(result)}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-[#9CA3AF]">
                          <span className="capitalize">{result.media_type}</span>
                          {getDate(result) && (
                            <>
                              <span>•</span>
                              <span>{new Date(getDate(result)).getFullYear()}</span>
                            </>
                          )}
                          {result.vote_average > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-[#F5C542]">★ {result.vote_average.toFixed(1)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {!loading && query.trim() && results.length === 0 && (
                <div className="text-center py-8 text-[#9CA3AF]">
                  No results found for &ldquo;{query}&rdquo;
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

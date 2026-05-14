"use client";

import { useState, useEffect } from "react";
import { Monitor, Plus, Search, Trash2, Film, Tv, Loader2, X } from "lucide-react";
import AdminGuard from "@/components/AdminGuard";
import { IContent, SearchResult } from "@/types";
import { TMDB_IMAGE_W500 } from "@/lib/constants";

const ADMIN_KEY = "WATCHMIRROR123";

export default function AdminPage() {
  const [content, setContent] = useState<IContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [tmdbQuery, setTmdbQuery] = useState("");
  const [tmdbResults, setTmdbResults] = useState<SearchResult[]>([]);
  const [tmdbLoading, setTmdbLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searched, setSearched] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [importType, setImportType] = useState<"movie" | "series">("movie");
  const [hlsLink, setHlsLink] = useState("");
  const [embedLink, setEmbedLink] = useState("");
  const [seasons, setSeasons] = useState("");
  const [importing, setImporting] = useState(false);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/content?limit=50&sort=-createdAt");
      const data = await res.json();
      setContent(data.items || []);
    } catch {
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleTmdbSearch = async () => {
    if (!tmdbQuery.trim()) return;
    setTmdbLoading(true);
    setSearchError("");
    setSearched(true);
    setSelectedItem(null);
    setSelectedDetails(null);
    try {
      const res = await fetch(`/api/tmdb/search?query=${encodeURIComponent(tmdbQuery)}`);
      const data = await res.json();
      if (!res.ok) {
        setSearchError(data?.error || "TMDB search failed");
        setTmdbResults([]);
        return;
      }
      setTmdbResults(data.results || []);
    } catch {
      setSearchError("Network error — TMDB unreachable");
      setTmdbResults([]);
    } finally {
      setTmdbLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedItem) {
      setSelectedDetails(null);
      return;
    }
    const mediaType = selectedItem.media_type === "tv" ? "tv" : "movie";
    setDetailsLoading(true);
    fetch(`/api/tmdb/details/${selectedItem.id}?type=${mediaType}`)
      .then((r) => r.json())
      .then((data) => setSelectedDetails(data))
      .catch(() => setSelectedDetails(null))
      .finally(() => setDetailsLoading(false));
  }, [selectedItem]);

  const handleImport = async () => {
    if (!selectedItem) return;
    setImporting(true);
    try {
      const tmdbId = selectedItem.id;
      const parsedSeasons = seasons ? seasons.split(",").map((s) => {
        const [num, count] = s.trim().split(":");
        return {
          seasonNumber: parseInt(num),
          episodes: Array.from({ length: parseInt(count) || 1 }, (_, i) => ({
            episodeNumber: i + 1,
            episodeTitle: `Episode ${i + 1}`,
            hlsLink: "",
            embedIframeLink: "",
            quality: "1080p",
          })),
        };
      }) : [];

      const res = await fetch("/api/admin/seed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": ADMIN_KEY,
        },
        body: JSON.stringify({
          tmdbId,
          type: importType,
          hlsLink,
          embedIframeLink: embedLink,
          seasons: parsedSeasons,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setTmdbQuery("");
        setTmdbResults([]);
        setSearchError("");
        setSearched(false);
        setSelectedItem(null);
        setSelectedDetails(null);
        setHlsLink("");
        setEmbedLink("");
        setSeasons("");
        fetchContent();
      }
    } catch {
      alert("Failed to import content");
    } finally {
      setImporting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this content?")) return;
    try {
      await fetch(`/api/content/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": ADMIN_KEY },
      });
      fetchContent();
    } catch {}
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#050608]">
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#F9FAFB]">WATCHMIRROR Admin Panel</h1>
              <p className="text-[#9CA3AF] text-sm mt-1">Manage your content library</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl gold-gradient text-[#050608] font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Add Content
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#F5C542] animate-spin" />
            </div>
          ) : (
            <div className="grid gap-3">
              {content.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#0E1015] border border-[#1F232D]"
                >
                  <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-[#1F232D] flex-shrink-0">
                    {item.poster && (
                      <img
                        src={item.poster}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-xs font-medium rounded bg-[#1F232D] text-[#F5C542]">
                        {item.type === "movie" ? <Film className="w-3 h-3 inline" /> : <Tv className="w-3 h-3 inline" />}
                        {" "}{item.type}
                      </span>
                      <p className="text-sm font-medium text-[#F9FAFB] truncate">{item.title}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[#9CA3AF]">
                      <span>{item.year}</span>
                      <span>{item.language}</span>
                      <span>{item.quality}</span>
                      <span>★ {item.rating?.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(item._id!)}
                      className="p-2 rounded-lg text-[#9CA3AF] hover:text-red-400 hover:bg-red-400/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {content.length === 0 && (
                <div className="text-center py-20 text-[#9CA3AF]">
                  No content yet. Click &quot;Add Content&quot; to get started.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-[#050608]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-[#0E1015] rounded-2xl border border-[#1F232D] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-[#1F232D]">
                <h2 className="text-lg font-bold text-[#F9FAFB]">Add Content</h2>
                <button onClick={() => { setShowAddModal(false); setTmdbResults([]); setSearchError(""); setSearched(false); setSelectedItem(null); setSelectedDetails(null); setHlsLink(""); setEmbedLink(""); setSeasons(""); }} className="p-1 rounded-lg hover:bg-[#1F232D] transition-colors">
                  <X className="w-5 h-5 text-[#9CA3AF]" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex gap-2">
                  <button
                    onClick={() => setImportType("movie")}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                      importType === "movie" ? "bg-[#F5C542] text-[#050608]" : "bg-[#1F232D] text-[#9CA3AF]"
                    }`}
                  >
                    <Film className="w-4 h-4 inline mr-1" /> Movie
                  </button>
                  <button
                    onClick={() => setImportType("series")}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                      importType === "series" ? "bg-[#F5C542] text-[#050608]" : "bg-[#1F232D] text-[#9CA3AF]"
                    }`}
                  >
                    <Tv className="w-4 h-4 inline mr-1" /> Series
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tmdbQuery}
                    onChange={(e) => setTmdbQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleTmdbSearch()}
                    placeholder="Search TMDB..."
                    className="flex-1 h-12 px-4 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F5C542]"
                  />
                  <button
                    onClick={handleTmdbSearch}
                    className="px-4 py-2 rounded-xl gold-gradient text-[#050608] font-semibold"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>

                {tmdbLoading && (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-5 h-5 text-[#F5C542] animate-spin" />
                  </div>
                )}

                {searchError && (
                  <div className="p-3 rounded-xl bg-red-400/10 border border-red-400/20 text-center">
                    <p className="text-red-400 text-sm">{searchError}</p>
                  </div>
                )}

                {!tmdbLoading && searched && !searchError && tmdbResults.length === 0 && (
                  <div className="text-center py-6 text-[#9CA3AF] text-sm">
                    No movies or series found for &ldquo;{tmdbQuery}&rdquo;
                  </div>
                )}

                {tmdbResults.length > 0 && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {tmdbResults.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setSelectedItem(r)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                          selectedItem?.id === r.id
                            ? "border-[#F5C542] bg-[#F5C542]/10"
                            : "border-[#1F232D] bg-[#050608] hover:border-[#F5C542]/30"
                        }`}
                      >
                        {r.poster_path && (
                          <img src={`${TMDB_IMAGE_W500}${r.poster_path}`} alt="" className="w-8 h-12 rounded object-cover" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#F9FAFB] truncate">{"title" in r ? r.title : "name" in r ? r.name : ""}</p>
                          <p className="text-xs text-[#9CA3AF]">
                            {"release_date" in r ? new Date(r.release_date!).getFullYear() : "first_air_date" in r ? new Date(r.first_air_date!).getFullYear() : ""}
                          </p>
                        </div>
                        <span className="text-xs text-[#F5C542]">★ {r.vote_average?.toFixed(1)}</span>
                      </button>
                    ))}
                  </div>
                )}

                {selectedDetails && !detailsLoading && (
                  <div className="p-4 rounded-xl bg-[#050608] border border-[#1F232D] space-y-3">
                    <div className="flex gap-4">
                      {selectedDetails.poster_path && (
                        <img src={`${TMDB_IMAGE_W500}${selectedDetails.poster_path}`} alt="" className="w-16 h-24 rounded-lg object-cover flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#F9FAFB]">{selectedDetails.title || selectedDetails.name}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-[#9CA3AF]">
                          <span>{selectedDetails.release_date?.slice(0, 4) || selectedDetails.first_air_date?.slice(0, 4)}</span>
                          <span>★ {selectedDetails.vote_average?.toFixed(1)}</span>
                          <span className="capitalize">{importType}</span>
                        </div>
                        <p className="text-xs text-[#9CA3AF] mt-2 line-clamp-2">{selectedDetails.overview}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {selectedDetails.genres?.slice(0, 4).map((g: any) => (
                            <span key={g.id} className="px-2 py-0.5 text-[10px] rounded bg-[#1F232D] text-[#F5C542]">{g.name}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {selectedDetails.credits?.cast?.slice(0, 5).length > 0 && (
                      <div>
                        <p className="text-xs text-[#9CA3AF] mb-1">Cast:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedDetails.credits.cast.slice(0, 5).map((c: any) => (
                            <span key={c.id} className="text-xs text-[#F9FAFB]">{c.name}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {detailsLoading && (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-5 h-5 text-[#F5C542] animate-spin" />
                  </div>
                )}

                {importType === "movie" && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={hlsLink}
                      onChange={(e) => setHlsLink(e.target.value)}
                      placeholder="HLS Stream URL (.m3u8)"
                      className="w-full h-12 px-4 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F5C542]"
                    />
                    <input
                      type="text"
                      value={embedLink}
                      onChange={(e) => setEmbedLink(e.target.value)}
                      placeholder="Embed Iframe URL (fallback)"
                      className="w-full h-12 px-4 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F5C542]"
                    />
                  </div>
                )}

                {importType === "series" && (
                  <div>
                    <label className="block text-sm text-[#9CA3AF] mb-2">
                      Seasons (format: 1:10,2:8,3:12 - season:episodes)
                    </label>
                    <input
                      type="text"
                      value={seasons}
                      onChange={(e) => setSeasons(e.target.value)}
                      placeholder="e.g. 1:10,2:8,3:12"
                      className="w-full h-12 px-4 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F5C542]"
                    />
                  </div>
                )}

                <button
                  onClick={handleImport}
                  disabled={!selectedItem || importing}
                  className="w-full h-12 rounded-xl gold-gradient text-[#050608] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  {importing ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    "Import Content"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}

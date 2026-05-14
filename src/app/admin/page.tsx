"use client";

import { useState, useEffect } from "react";
import { Monitor, Plus, Search, Trash2, Edit3, Film, Tv, Loader2, X, Save, Eye, Hash, Star, Globe, Calendar, Check, ChevronRight, ChevronLeft } from "lucide-react";
import AdminGuard from "@/components/AdminGuard";
import { IContent, SearchResult } from "@/types";
import { TMDB_IMAGE_W500, LANGUAGES, LANGUAGES_GROUPED } from "@/lib/constants";

const ADMIN_KEY = "WATCHMIRROR123";

export default function AdminPage() {
  const [content, setContent] = useState<IContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "movie" | "series">("all");

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Add modal
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
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedDubLanguages, setSelectedDubLanguages] = useState<string[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<string[]>(["English"]);
  const [importing, setImporting] = useState(false);
  const [step, setStep] = useState(1);

  // Edit modal
  const [editItem, setEditItem] = useState<IContent | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/content?limit=100&sort=-createdAt");
      const data = await res.json();
      setContent(data.items || []);
    } catch {
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContent(); }, []);

  const stats = {
    total: content.length,
    movies: content.filter((c) => c.type === "movie").length,
    series: content.filter((c) => c.type === "series").length,
  };

  const filtered = content.filter((c) => {
    if (filterType !== "all" && c.type !== filterType) return false;
    if (!localSearch.trim()) return true;
    const q = localSearch.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q) ||
      c.language?.toLowerCase().includes(q) ||
      c.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  // --- TMDB Search ---
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
      if (!res.ok) { setSearchError(data?.error || "TMDB search failed"); setTmdbResults([]); return; }
      setTmdbResults(data.results || []);
    } catch {
      setSearchError("Network error - TMDB unreachable");
      setTmdbResults([]);
    } finally { setTmdbLoading(false); }
  };

  useEffect(() => {
    if (!selectedItem) { setSelectedDetails(null); return; }
    const mt = selectedItem.media_type === "tv" ? "tv" : "movie";
    setDetailsLoading(true);
    fetch(`/api/tmdb/details/${selectedItem.id}?type=${mt}`)
      .then((r) => r.json()).then(setSelectedDetails)
      .catch(() => setSelectedDetails(null))
      .finally(() => setDetailsLoading(false));
  }, [selectedItem]);

  // --- Import ---
  const handleImport = async () => {
    if (!selectedItem) return;
    setImporting(true);
    try {
      const parsedSeasons = seasons
        ? seasons.split(",").map((s) => {
            const [num, count] = s.trim().split(":");
            return {
              seasonNumber: parseInt(num),
              episodes: Array.from({ length: parseInt(count) || 1 }, (_, i) => ({
                episodeNumber: i + 1,
                episodeTitle: `Episode ${i + 1}`,
                hlsLink: "", embedIframeLink: "", quality: "1080p",
              })),
            };
          })
        : [];
      const res = await fetch("/api/admin/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
        body: JSON.stringify({ tmdbId: selectedItem.id, type: importType, hlsLink, embedIframeLink: embedLink, seasons: parsedSeasons, language: selectedLanguage, dubLanguages: selectedDubLanguages, audioAvailable: selectedAudio }),
      });
      if (res.ok) {
        setShowAddModal(false); resetAddModal(); fetchContent();
        showToast("Content imported successfully");
      } else {
        const d = await res.json().catch(() => ({}));
        showToast(d?.error || "Import failed", "error");
      }
    } catch { showToast("Network error — import failed", "error"); }
    finally { setImporting(false); }
  };

  const resetAddModal = () => {
    setTmdbQuery(""); setTmdbResults([]); setSearchError(""); setSearched(false);
    setSelectedItem(null); setSelectedDetails(null); setHlsLink(""); setEmbedLink(""); setSeasons("");
    setSelectedLanguage("English"); setSelectedDubLanguages([]); setSelectedAudio(["English"]);
    setStep(1);
  };

  // --- Edit ---
  const openEdit = (item: IContent) => {
    setEditItem(item);
    const d = JSON.parse(JSON.stringify(item));
    if (!d.audioAvailable) d.audioAvailable = [];
    if (!d.dubLanguage) d.dubLanguage = [];
    setEditData(d);
  };

  const handleEditSave = async () => {
    if (!editItem?._id || !editData) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/content/${editItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
        body: JSON.stringify(editData),
      });
      if (res.ok) { setEditItem(null); setEditData(null); fetchContent(); showToast("Changes saved"); }
      else showToast("Failed to save", "error");
    } catch { showToast("Failed to save", "error"); }
    finally { setSaving(false); }
  };

  const updateEpisode = (si: number, ei: number, field: string, value: string) => {
    const d = { ...editData };
    if (d.seasons?.[si]?.episodes?.[ei]) {
      d.seasons[si].episodes[ei][field] = value;
      setEditData(d);
    }
  };

  // --- Delete ---
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this content?")) return;
    try {
      await fetch(`/api/content/${id}`, { method: "DELETE", headers: { "x-admin-key": ADMIN_KEY } });
      fetchContent(); showToast("Content deleted");
    } catch {}
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#050608]">
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#F9FAFB]">WATCHMIRROR Admin Panel</h1>
              <p className="text-[#9CA3AF] text-sm mt-1">Manage your content library</p>
            </div>
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl gold-gradient text-[#050608] font-semibold hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" /> Add Content
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-[#0E1015] border border-[#1F232D]">
              <p className="text-2xl font-bold text-[#F5C542]">{stats.total}</p>
              <p className="text-xs text-[#9CA3AF]">Total Content</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#0E1015] border border-[#1F232D]">
              <p className="text-2xl font-bold text-[#8B5CF6]">{stats.movies}</p>
              <p className="text-xs text-[#9CA3AF]">Movies</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#0E1015] border border-[#1F232D]">
              <p className="text-2xl font-bold text-[#22C55E]">{stats.series}</p>
              <p className="text-xs text-[#9CA3AF]">Series</p>
            </div>
          </div>

          {/* Toast */}
          {toast && (
            <div className={`fixed top-6 right-6 z-[60] px-5 py-3 rounded-2xl shadow-2xl border text-sm font-medium transition-all ${
              toast.type === "success"
                ? "bg-[#22C55E]/20 border-[#22C55E]/40 text-[#22C55E]"
                : "bg-red-400/20 border-red-400/40 text-red-400"
            }`}>
              {toast.msg}
            </div>
          )}

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input type="text" value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} placeholder="Search title, category, language..." className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#0E1015] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF] text-sm focus:outline-none focus:border-[#F5C542] transition-colors" />
            </div>
            <div className="flex gap-1">
              {(["all", "movie", "series"] as const).map((f) => (
                <button key={f} onClick={() => setFilterType(f)} className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${filterType === f ? "bg-[#F5C542] text-[#050608]" : "bg-[#0E1015] text-[#9CA3AF] border border-[#1F232D] hover:border-[#F5C542]/50"}`}>
                  {f === "all" ? "All" : f === "movie" ? <><Film className="w-3 h-3 inline mr-1" />Movies</> : <><Tv className="w-3 h-3 inline mr-1" />Series</>}
                </button>
              ))}
            </div>
          </div>

          {/* Content List */}
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-[#F5C542] animate-spin" /></div>
          ) : (
            <>
              <p className="text-xs text-[#9CA3AF] mb-3">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
              <div className="grid gap-2">
                {filtered.map((item) => (
                  <div key={item._id} className="flex items-center gap-3 p-3 rounded-2xl bg-[#0E1015] border border-[#1F232D] hover:border-[#1F232D]/80 transition-colors">
                    <div className="relative w-10 h-14 rounded-lg overflow-hidden bg-[#1F232D] flex-shrink-0">
                      {item.poster && <img src={item.poster} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${item.type === "movie" ? "bg-[#8B5CF6]/20 text-[#8B5CF6]" : "bg-[#22C55E]/20 text-[#22C55E]"}`}>
                          {item.type === "movie" ? "MOVIE" : "SERIES"}
                        </span>
                        <p className="text-sm font-medium text-[#F9FAFB] truncate">{item.title}</p>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 text-[11px] text-[#9CA3AF]">
                        <span>{item.year}</span>
                        <span className="capitalize">{item.category}</span>
                        <span>{item.language}</span>
                        {item.rating > 0 && <span className="text-[#F5C542]">★ {item.rating.toFixed(1)}</span>}
                        {item.hlsLink && <span className="text-[#22C55E]">HLS</span>}
                        {item.embedIframeLink && !item.hlsLink && <span className="text-[#8B5CF6]">Embed</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-[#9CA3AF] hover:text-[#F5C542] hover:bg-[#F5C542]/10 transition-all" title="Edit">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item._id!)} className="p-2 rounded-lg text-[#9CA3AF] hover:text-red-400 hover:bg-red-400/10 transition-all" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="text-center py-16 text-[#9CA3AF]">
                    {localSearch || filterType !== "all" ? "No content matches your search." : 'No content yet. Click "Add Content" to get started.'}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* ADD MODAL — Multi-step wizard */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-[#050608]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-[#0E1015] rounded-2xl border border-[#1F232D] max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#1F232D]">
                <h2 className="text-lg font-bold text-[#F9FAFB]">Add Content</h2>
                <button onClick={() => { setShowAddModal(false); resetAddModal(); }} className="p-1 rounded-lg hover:bg-[#1F232D] transition-colors">
                  <X className="w-5 h-5 text-[#9CA3AF]" />
                </button>
              </div>

              {/* Step indicator */}
              <div className="flex items-center justify-center gap-2 px-6 pt-6">
                {[
                  { num: 1, label: "Search" },
                  { num: 2, label: "Details" },
                  { num: 3, label: "Review" },
                ].map((s, i) => (
                  <div key={s.num} className="flex items-center gap-2">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      step === s.num
                        ? "bg-[#F5C542] text-[#050608]"
                        : step > s.num
                        ? "bg-[#22C55E]/20 text-[#22C55E]"
                        : "bg-[#1F232D] text-[#9CA3AF]"
                    }`}>
                      {step > s.num ? <Check className="w-3.5 h-3.5" /> : <span>{s.num}</span>}
                      <span>{s.label}</span>
                    </div>
                    {i < 2 && <div className={`w-8 h-px ${step > s.num ? "bg-[#22C55E]" : "bg-[#1F232D]"}`} />}
                  </div>
                ))}
              </div>

              <div className="p-6 space-y-5">
                {/* ====== STEP 1: SEARCH ====== */}
                {step === 1 && (
                  <>
                    <div className="flex gap-2">
                      <button onClick={() => setImportType("movie")} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${importType === "movie" ? "bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20" : "bg-[#1F232D] text-[#9CA3AF]"}`}>
                        <Film className="w-4 h-4 inline mr-1" /> Movie
                      </button>
                      <button onClick={() => setImportType("series")} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${importType === "series" ? "bg-[#22C55E] text-white shadow-lg shadow-[#22C55E]/20" : "bg-[#1F232D] text-[#9CA3AF]"}`}>
                        <Tv className="w-4 h-4 inline mr-1" /> Series
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                        <input type="text" value={tmdbQuery} onChange={(e) => setTmdbQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleTmdbSearch()} placeholder="Search TMDB for movies or series..." className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F5C542]" />
                      </div>
                      <button onClick={handleTmdbSearch} className="px-5 h-12 rounded-xl gold-gradient text-[#050608] font-semibold hover:opacity-90 transition-opacity"><Search className="w-4 h-4" /></button>
                    </div>

                    {tmdbLoading && <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 text-[#F5C542] animate-spin" /></div>}
                    {searchError && <div className="p-3 rounded-xl bg-red-400/10 border border-red-400/20 text-center"><p className="text-red-400 text-sm">{searchError}</p></div>}
                    {!tmdbLoading && searched && !searchError && tmdbResults.length === 0 && (
                      <div className="text-center py-6 text-[#9CA3AF] text-sm">No results found for &ldquo;{tmdbQuery}&rdquo;</div>
                    )}

                    {tmdbResults.length > 0 && (
                      <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                        {tmdbResults.map((r) => (
                          <button key={r.id} onClick={() => setSelectedItem(r)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                              selectedItem?.id === r.id
                                ? "border-[#F5C542] bg-[#F5C542]/10 ring-1 ring-[#F5C542]/30"
                                : "border-[#1F232D] bg-[#050608] hover:border-[#F5C542]/30"
                            }`}>
                            {r.poster_path ? (
                              <img src={`${TMDB_IMAGE_W500}${r.poster_path}`} alt="" className="w-10 h-14 rounded-lg object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-10 h-14 rounded-lg bg-[#1F232D] flex items-center justify-center flex-shrink-0">
                                <Film className="w-4 h-4 text-[#9CA3AF]" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-[#F9FAFB] font-medium truncate">{"title" in r ? r.title : "name" in r ? r.name : ""}</p>
                              <p className="text-xs text-[#9CA3AF] mt-0.5">
                                {"release_date" in r ? new Date(r.release_date!).getFullYear() : "first_air_date" in r ? new Date(r.first_air_date!).getFullYear() : ""}
                                {"media_type" in r && r.media_type && <span className="ml-2 px-1.5 py-0.5 rounded bg-[#1F232D] text-[10px] uppercase">{r.media_type}</span>}
                              </p>
                            </div>
                            <span className="text-xs text-[#F5C542] flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" /> {r.vote_average?.toFixed(1)}
                            </span>
                            {selectedItem?.id === r.id && (
                              <Check className="w-4 h-4 text-[#F5C542] flex-shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {selectedDetails && !detailsLoading && (
                      <div className="p-4 rounded-xl bg-gradient-to-br from-[#050608] to-[#0E1015] border border-[#1F232D]">
                        <div className="flex gap-4">
                          {selectedDetails.poster_path && <img src={`${TMDB_IMAGE_W500}${selectedDetails.poster_path}`} alt="" className="w-16 h-24 rounded-lg object-cover flex-shrink-0 shadow-lg" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#F9FAFB]">{selectedDetails.title || selectedDetails.name}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-[#9CA3AF]">
                              <span>{selectedDetails.release_date?.slice(0, 4) || selectedDetails.first_air_date?.slice(0, 4)}</span>
                              <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[#F5C542]" /> {selectedDetails.vote_average?.toFixed(1)}</span>
                            </div>
                            <p className="text-xs text-[#9CA3AF] mt-2 line-clamp-2 leading-relaxed">{selectedDetails.overview}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {selectedDetails.genres?.slice(0, 4).map((g: any) => (
                                <span key={g.id} className="px-2 py-0.5 text-[10px] rounded-full bg-[#1F232D] text-[#F5C542]">{g.name}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {detailsLoading && <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 text-[#F5C542] animate-spin" /></div>}

                    <div className="flex justify-end pt-2">
                      <button onClick={() => selectedItem && setStep(2)} disabled={!selectedItem} className="flex items-center gap-2 px-6 h-12 rounded-xl gold-gradient text-[#050608] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">
                        Next <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}

                {/* ====== STEP 2: DETAILS ====== */}
                {step === 2 && (
                  <>
                    {/* Selected item summary */}
                    {selectedDetails && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-[#050608] border border-[#1F232D]">
                        {selectedDetails.poster_path && <img src={`${TMDB_IMAGE_W500}${selectedDetails.poster_path}`} alt="" className="w-10 h-14 rounded-lg object-cover flex-shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#F9FAFB]">{selectedDetails.title || selectedDetails.name}</p>
                          <p className="text-xs text-[#9CA3AF]">{selectedDetails.release_date?.slice(0, 4) || selectedDetails.first_air_date?.slice(0, 4)} &middot; {importType === "movie" ? "Movie" : "Series"}</p>
                        </div>
                        <span className="text-xs text-[#F5C542]">★ {selectedDetails.vote_average?.toFixed(1)}</span>
                      </div>
                    )}

                    {/* Language */}
                    <div>
                      <label className="block text-xs text-[#9CA3AF] mb-2 font-medium">Language</label>
                      <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="w-full h-12 px-4 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] text-sm focus:outline-none focus:border-[#F5C542] focus:ring-1 focus:ring-[#F5C542]/30 appearance-none cursor-pointer">
                        <option value="" className="bg-[#0E1015]">Select language</option>
                        {LANGUAGES_GROUPED.map((group) => (
                          <optgroup key={group.label} label={group.label}>
                            {group.languages.map((l) => (
                              <option key={l} value={l} className="bg-[#0E1015]">{l}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    {/* Dub Languages */}
                    <div>
                      <label className="block text-xs text-[#9CA3AF] mb-2 font-medium">Dub Languages <span className="text-[#9CA3AF]/50">(optional, multi-select)</span></label>
                      <div className="flex flex-wrap gap-2">
                        {LANGUAGES.map((l) => {
                          const active = selectedDubLanguages.includes(l);
                          return (
                            <button key={l} onClick={() => {
                              setSelectedDubLanguages((prev) =>
                                active ? prev.filter((a) => a !== l) : [...prev, l]
                              );
                            }} className={`px-3 py-1.5 rounded-none text-xs font-medium border transition-all ${
                              active
                                ? "bg-[#F5C542] text-[#050608] border-[#F5C542] shadow-sm"
                                : "bg-[#050608] text-[#9CA3AF] border-[#1F232D] hover:border-[#F5C542]/50"
                            }`}>
                              {l}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Audio Available */}
                    <div>
                      <label className="block text-xs text-[#9CA3AF] mb-2 font-medium">Audio Available</label>
                      <div className="flex flex-wrap gap-2">
                        {LANGUAGES.map((l) => {
                          const active = selectedAudio.includes(l);
                          return (
                            <button key={l} onClick={() => {
                              setSelectedAudio((prev) =>
                                active ? prev.filter((a) => a !== l) : [...prev, l]
                              );
                            }} className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                              active
                                ? "bg-[#F5C542] text-[#050608] border-[#F5C542] shadow-sm"
                                : "bg-[#050608] text-[#9CA3AF] border-[#1F232D] hover:border-[#F5C542]/50"
                            }`}>
                              {l}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Movie streams */}
                    {importType === "movie" && (
                      <div className="space-y-3 p-4 rounded-xl bg-[#050608] border border-[#1F232D]">
                        <p className="text-xs font-medium text-[#F9FAFB]">Stream Sources</p>
                        <input type="text" value={hlsLink} onChange={(e) => setHlsLink(e.target.value)} placeholder="HLS Stream URL (.m3u8)" className="w-full h-11 px-4 rounded-xl bg-[#0E1015] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF] text-sm focus:outline-none focus:border-[#F5C542]" />
                        <input type="text" value={embedLink} onChange={(e) => setEmbedLink(e.target.value)} placeholder="Embed Iframe URL (fallback)" className="w-full h-11 px-4 rounded-xl bg-[#0E1015] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF] text-sm focus:outline-none focus:border-[#F5C542]" />
                      </div>
                    )}

                    {/* Series seasons */}
                    {importType === "series" && (
                      <div className="p-4 rounded-xl bg-[#050608] border border-[#1F232D]">
                        <label className="block text-xs text-[#9CA3AF] mb-2 font-medium">Seasons</label>
                        <p className="text-[10px] text-[#9CA3AF] mb-2">Format: <code className="text-[#F5C542]">season:episodes</code>, comma separated</p>
                        <input type="text" value={seasons} onChange={(e) => setSeasons(e.target.value)} placeholder="e.g. 1:10, 2:8, 3:12" className="w-full h-11 px-4 rounded-xl bg-[#0E1015] border border-[#1F232D] text-[#F9FAFB] placeholder-[#9CA3AF] text-sm focus:outline-none focus:border-[#F5C542]" />
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-2">
                      <button onClick={() => setStep(1)} className="flex items-center gap-2 px-5 h-12 rounded-xl bg-[#1F232D] text-[#F9FAFB] font-medium hover:bg-[#1F232D]/80 transition-all">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <button onClick={() => setStep(3)} className="flex items-center gap-2 px-6 h-12 rounded-xl gold-gradient text-[#050608] font-semibold hover:opacity-90 transition-opacity">
                        Next <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}

                {/* ====== STEP 3: REVIEW & IMPORT ====== */}
                {step === 3 && (
                  <>
                    {/* Preview Card */}
                    <div className="rounded-2xl bg-gradient-to-br from-[#050608] to-[#0E1015] border border-[#1F232D] overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        {/* Poster */}
                        <div className="relative w-full sm:w-48 h-56 sm:h-auto bg-[#1F232D] flex-shrink-0">
                          {selectedDetails?.poster_path ? (
                            <img src={`${TMDB_IMAGE_W500}${selectedDetails.poster_path}`} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Film className="w-12 h-12 text-[#9CA3AF]" />
                            </div>
                          )}
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#F5C542] text-[#050608]">
                            {importType}
                          </div>
                        </div>
                        {/* Info */}
                        <div className="flex-1 p-5 space-y-3">
                          <h3 className="text-lg font-bold text-[#F9FAFB]">{selectedDetails?.title || selectedDetails?.name || "Untitled"}</h3>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-[#9CA3AF]">
                            <span>{selectedDetails?.release_date?.slice(0, 4) || selectedDetails?.first_air_date?.slice(0, 4) || "—"}</span>
                            <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[#F5C542]" /> {selectedDetails?.vote_average?.toFixed(1) || "—"}</span>
                            <span className="px-2 py-0.5 rounded bg-[#1F232D]">{selectedLanguage}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedAudio.map((a) => (
                              <span key={a} className="px-2 py-0.5 rounded text-[10px] bg-[#F5C542]/10 text-[#F5C542] border border-[#F5C542]/20">
                                🔊 {a}
                              </span>
                            ))}
                          </div>
                          {selectedDetails?.overview && (
                            <p className="text-xs text-[#9CA3AF] leading-relaxed line-clamp-2">{selectedDetails.overview}</p>
                          )}
                          {selectedDetails?.genres && (
                            <div className="flex flex-wrap gap-1">
                              {selectedDetails.genres.slice(0, 4).map((g: any) => (
                                <span key={g.id} className="px-2 py-0.5 text-[10px] rounded-full bg-[#1F232D] text-[#F5C542]">{g.name}</span>
                              ))}
                            </div>
                          )}
                          <div className="pt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#9CA3AF]">
                            {importType === "movie" && (
                              <>
                                <span className={hlsLink ? "text-[#22C55E]" : ""}>HLS: {hlsLink ? "Connected" : "Not set"}</span>
                                <span className={embedLink ? "text-[#8B5CF6]" : ""}>Embed: {embedLink ? "Connected" : "Not set"}</span>
                              </>
                            )}
                            {importType === "series" && (
                              <span>{seasons ? seasons.split(",").length + " seasons" : "No seasons configured"}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-2">
                      <button onClick={() => setStep(2)} className="flex items-center gap-2 px-5 h-12 rounded-xl bg-[#1F232D] text-[#F9FAFB] font-medium hover:bg-[#1F232D]/80 transition-all">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <button onClick={handleImport} disabled={importing} className="flex items-center gap-2 px-8 h-12 rounded-xl gold-gradient text-[#050608] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">
                        {importing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-4 h-4" /> Import Content</>}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {editItem && editData && (
          <div className="fixed inset-0 z-50 bg-[#050608]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-[#0E1015] rounded-2xl border border-[#1F232D] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-[#1F232D]">
                <h2 className="text-lg font-bold text-[#F9FAFB]">Edit: {editItem.title}</h2>
                <button onClick={() => { setEditItem(null); setEditData(null); }} className="p-1 rounded-lg hover:bg-[#1F232D] transition-colors">
                  <X className="w-5 h-5 text-[#9CA3AF]" />
                </button>
              </div>
              <div className="p-6 space-y-5">
                {/* Basic fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#9CA3AF] mb-1">Title</label>
                    <input type="text" value={editData.title || ""} onChange={(e) => setEditData({ ...editData, title: e.target.value })} className="w-full h-10 px-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] text-sm focus:outline-none focus:border-[#F5C542]" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#9CA3AF] mb-1">Year</label>
                    <input type="number" value={editData.year || ""} onChange={(e) => setEditData({ ...editData, year: parseInt(e.target.value) || 0 })} className="w-full h-10 px-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] text-sm focus:outline-none focus:border-[#F5C542]" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#9CA3AF] mb-1">Category</label>
                    <input type="text" value={editData.category || ""} onChange={(e) => setEditData({ ...editData, category: e.target.value })} className="w-full h-10 px-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] text-sm focus:outline-none focus:border-[#F5C542]" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#9CA3AF] mb-1">Language</label>
                    <select value={editData.language || "English"} onChange={(e) => setEditData({ ...editData, language: e.target.value })} className="w-full h-10 px-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] text-sm focus:outline-none focus:border-[#F5C542] appearance-none cursor-pointer">
                      <option value="" className="bg-[#0E1015]">Select language</option>
                      {LANGUAGES_GROUPED.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                          {group.languages.map((l) => (
                            <option key={l} value={l} className="bg-[#0E1015]">{l}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#9CA3AF] mb-1">Dub Languages <span className="text-[#9CA3AF]/50">(multi-select)</span></label>
                    <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                      {LANGUAGES.map((l) => {
                        const active = (editData.dubLanguage || []).includes(l);
                        return (
                          <button key={l} onClick={() => {
                            const current = editData.dubLanguage || [];
                            setEditData({
                              ...editData,
                              dubLanguage: active
                                ? current.filter((a: string) => a !== l)
                                : [...current, l],
                            });
                          }} className={`px-2 py-1 rounded-none text-[10px] font-medium border transition-all ${
                            active
                              ? "bg-[#F5C542] text-[#050608] border-[#F5C542]"
                              : "bg-[#050608] text-[#9CA3AF] border-[#1F232D] hover:border-[#F5C542]/50"
                          }`}>
                            {l}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-[#9CA3AF] mb-1">Quality</label>
                    <input type="text" value={editData.quality || ""} onChange={(e) => setEditData({ ...editData, quality: e.target.value })} className="w-full h-10 px-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] text-sm focus:outline-none focus:border-[#F5C542]" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#9CA3AF] mb-1">Rating (0-10)</label>
                    <input type="number" step="0.1" value={editData.rating || 0} onChange={(e) => setEditData({ ...editData, rating: parseFloat(e.target.value) || 0 })} className="w-full h-10 px-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] text-sm focus:outline-none focus:border-[#F5C542]" />
                  </div>
                </div>

                {/* Audio Available */}
                <div>
                  <label className="block text-xs text-[#9CA3AF] mb-2">Audio Available</label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map((l) => {
                      const audio = editData.audioAvailable || [];
                      const active = audio.includes(l);
                      return (
                        <button key={l} onClick={() => {
                          setEditData({
                            ...editData,
                            audioAvailable: active
                              ? audio.filter((a: string) => a !== l)
                              : [...audio, l],
                          });
                        }} className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          active
                            ? "bg-[#F5C542] text-[#050608] border-[#F5C542]"
                            : "bg-[#050608] text-[#9CA3AF] border-[#1F232D] hover:border-[#F5C542]/50"
                        }`}>
                          {l}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs text-[#9CA3AF] mb-1">Description</label>
                  <textarea value={editData.description || ""} onChange={(e) => setEditData({ ...editData, description: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] text-sm focus:outline-none focus:border-[#F5C542] resize-none" />
                </div>

                {/* Movie stream links */}
                {editItem.type === "movie" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-[#9CA3AF] mb-1">HLS Stream URL</label>
                      <input type="text" value={editData.hlsLink || ""} onChange={(e) => setEditData({ ...editData, hlsLink: e.target.value })} placeholder=".m3u8 URL" className="w-full h-10 px-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] text-sm focus:outline-none focus:border-[#F5C542]" />
                    </div>
                    <div>
                      <label className="block text-xs text-[#9CA3AF] mb-1">Embed Iframe URL</label>
                      <input type="text" value={editData.embedIframeLink || ""} onChange={(e) => setEditData({ ...editData, embedIframeLink: e.target.value })} placeholder="Fallback embed URL" className="w-full h-10 px-3 rounded-xl bg-[#050608] border border-[#1F232D] text-[#F9FAFB] text-sm focus:outline-none focus:border-[#F5C542]" />
                    </div>
                  </div>
                )}

                {/* Series seasons/episodes */}
                {editItem.type === "series" && editData.seasons && (
                  <div>
                    <label className="block text-xs text-[#9CA3AF] mb-3">Seasons & Episodes</label>
                    <div className="space-y-4">
                      {editData.seasons.map((season: any, si: number) => (
                        <div key={si} className="p-4 rounded-xl bg-[#050608] border border-[#1F232D]">
                          <p className="text-sm font-medium text-[#F5C542] mb-3">Season {season.seasonNumber}</p>
                          <div className="space-y-2">
                            {season.episodes.map((ep: any, ei: number) => (
                              <div key={ei} className="flex flex-col sm:flex-row gap-2 p-2 rounded-lg bg-[#0E1015] border border-[#1F232D]">
                                <div className="flex-1">
                                  <input type="text" value={ep.episodeTitle} onChange={(e) => updateEpisode(si, ei, "episodeTitle", e.target.value)} placeholder="Episode title" className="w-full h-9 px-3 rounded-lg bg-[#050608] border border-[#1F232D] text-[#F9FAFB] text-xs focus:outline-none focus:border-[#F5C542]" />
                                </div>
                                <div className="flex gap-2">
                                  <input type="text" value={ep.hlsLink || ""} onChange={(e) => updateEpisode(si, ei, "hlsLink", e.target.value)} placeholder="HLS URL" className="w-36 h-9 px-3 rounded-lg bg-[#050608] border border-[#1F232D] text-[#F9FAFB] text-xs focus:outline-none focus:border-[#F5C542]" />
                                  <input type="text" value={ep.embedIframeLink || ""} onChange={(e) => updateEpisode(si, ei, "embedIframeLink", e.target.value)} placeholder="Embed URL" className="w-36 h-9 px-3 rounded-lg bg-[#050608] border border-[#1F232D] text-[#F9FAFB] text-xs focus:outline-none focus:border-[#F5C542]" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button onClick={handleEditSave} disabled={saving} className="w-full h-12 rounded-xl gold-gradient text-[#050608] font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}

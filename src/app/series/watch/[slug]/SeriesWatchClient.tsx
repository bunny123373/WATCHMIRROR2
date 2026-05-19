"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Film, ChevronLeft, ChevronRight, Headphones, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addContinueWatching } from "@/store/slices/continueSlice";
import { markEpisodeWatched, setWatchedEpisodes } from "@/store/slices/episodeProgressSlice";
import { RootState } from "@/store/store";
import HLSPlayer from "@/components/HLSPlayer";
import IframePlayer from "@/components/IframePlayer";
import { PeachifyPlayer } from "@/components/PeachifyPlayer";
import DownloadButton from "@/components/DownloadButton";
import { IContent, Season } from "@/types";

interface SeriesWatchClientProps {
  item: IContent;
  currentEpisode: {
    episodeNumber: number;
    episodeTitle: string;
    hlsLink?: string;
    embedIframeLink?: string;
    peachifyId?: string;
    downloadLink?: string;
    quality: string;
    streams?: { language: string; hlsLink: string; embedIframeLink: string }[];
  } | null;
  currentSeason: number;
  currentEpisodeNum: number;
  seasons: Season[];
  audio?: string;
  variant?: "default" | "prime";
  detailsHref?: string;
  watchBasePath?: string;
}

export default function SeriesWatchClient({
  item,
  currentEpisode,
  currentSeason,
  currentEpisodeNum,
  seasons,
  audio,
  variant = "default",
  detailsHref,
  watchBasePath = "/series/watch",
}: SeriesWatchClientProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const isPrime = variant === "prime";
  const accentText = isPrime ? "text-[#00A8E1]" : "text-[#F5C542]";
  const accentHover = isPrime ? "hover:text-[#00A8E1]" : "hover:text-[#F5C542]";
  const detailsUrl = detailsHref || `/series/${item.slug}`;
  const watched = useSelector((s: RootState) => s.episodeProgress.watched);
  const [autoPlayCountdown, setAutoPlayCountdown] = useState<number | null>(null);

  // Hydrate from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("watchmirror_watched");
    if (stored) {
      try { dispatch(setWatchedEpisodes(JSON.parse(stored))); } catch {}
    }
  }, [dispatch]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("watchmirror_watched", JSON.stringify(watched));
  }, [watched]);

  const hasHls = !!(currentEpisode?.hlsLink?.trim() || (audio && currentEpisode?.streams?.find((s) => s.language === audio)?.hlsLink));
  const hasEmbed = !!currentEpisode?.embedIframeLink?.trim();
  const hasPeachify = !!(currentEpisode?.peachifyId || item.tmdbId);
  const canStream = hasHls || hasPeachify || hasEmbed;

  const episodeHlsSrc = (audio && currentEpisode?.streams?.find((s) => s.language === audio)?.hlsLink)
    || currentEpisode?.hlsLink || "";

  const allEpisodes = seasons.flatMap((s) =>
    s.episodes.map((e) => ({
      ...e,
      seasonNumber: s.seasonNumber,
    }))
  );

  const currentIndex = allEpisodes.findIndex(
    (e) => e.seasonNumber === currentSeason && e.episodeNumber === currentEpisodeNum
  );

  const prevEpisode = currentIndex > 0 ? allEpisodes[currentIndex - 1] : null;
  const nextEpisode =
    currentIndex < allEpisodes.length - 1 ? allEpisodes[currentIndex + 1] : null;

  const isWatched = (sn: number, en: number) =>
    watched.some((w) => w.slug === item.slug && w.seasonNumber === sn && w.episodeNumber === en);

  const saveProgress = useCallback(
    (currentTime: number, duration: number) => {
      if (duration > 0 && currentTime / duration > 0.9) return;
      if (currentTime < 30) return;

      dispatch(
        addContinueWatching({
          slug: item.slug,
          type: "series",
          title: item.title,
          poster: item.poster,
          currentTime,
          duration,
          seasonNumber: currentSeason,
          episodeNumber: currentEpisodeNum,
          updatedAt: Date.now(),
        })
      );
    },
    [dispatch, item.slug, item.title, item.poster, currentSeason, currentEpisodeNum]
  );

  const handleEnded = useCallback(() => {
    dispatch(markEpisodeWatched({
      slug: item.slug,
      seasonNumber: currentSeason,
      episodeNumber: currentEpisodeNum,
      watchedAt: Date.now(),
    }));

    if (nextEpisode) {
      setAutoPlayCountdown(10);
    }
  }, [dispatch, item.slug, currentSeason, currentEpisodeNum, nextEpisode]);

  useEffect(() => {
    if (autoPlayCountdown === null) return;
    if (autoPlayCountdown <= 0) {
      setAutoPlayCountdown(null);
      if (nextEpisode) {
        router.push(`${watchBasePath}/${item.slug}?season=${nextEpisode.seasonNumber}&episode=${nextEpisode.episodeNumber}${audio ? `&audio=${encodeURIComponent(audio)}` : ""}`);
      }
      return;
    }
    const timer = setTimeout(() => setAutoPlayCountdown(autoPlayCountdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [autoPlayCountdown, nextEpisode, item.slug, audio, router, watchBasePath]);

  const cancelAutoPlay = () => setAutoPlayCountdown(null);

  return (
    <main className={`min-h-screen pt-14 md:pt-28 pb-20 md:pb-0 ${isPrime ? "bg-[#0F171E]" : "bg-[#050608]"}`}>
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-6">
        <Link
          href={detailsUrl}
          className={`inline-flex items-center gap-2 text-[#9CA3AF] ${accentHover} transition-colors mb-4`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to series
        </Link>

        {isPrime && <p className="text-xs font-bold tracking-wide text-[#00A8E1] mb-2">PRIME VIDEO</p>}
        <h1 className="text-2xl font-bold text-[#F9FAFB] mb-2">{item.title}</h1>
        {currentEpisode && (
          <p className="text-[#9CA3AF] mb-4">
            Season {currentSeason} Episode {currentEpisode.episodeNumber} &mdash;{" "}
            {currentEpisode.episodeTitle}
          </p>
        )}
        {audio && (
          <p className={`text-xs ${accentText} mb-3 flex items-center gap-1`}>
            <Headphones className="w-3 h-3" /> Audio: {audio}
          </p>
        )}

          {canStream ? (
          hasHls ? (
            <>
              <HLSPlayer src={episodeHlsSrc} poster={item.banner} autoPlay audioTrack={audio || undefined} onProgress={saveProgress} onEnded={handleEnded} variant={variant} />
              <div className="mt-3">
                <DownloadButton slug={`${item.slug}-s${currentSeason}e${currentEpisodeNum}`} label="Download Episode" />
              </div>
            </>
          ) : hasPeachify ? (
            <PeachifyPlayer type="tv" mediaId={currentEpisode!.peachifyId || String(item.tmdbId!)} season={currentSeason} episode={currentEpisodeNum} dub={audio} hide={["servers"]} />
          ) : (
            <IframePlayer src={currentEpisode?.streams?.find((s) => s.language === audio)?.embedIframeLink || currentEpisode!.embedIframeLink!} />
          )
        ) : (
          <div className={`w-full aspect-video rounded-2xl flex items-center justify-center ${isPrime ? "bg-[#1A242D] border border-[#2D3A45]" : "bg-[#0E1015] border border-[#1F232D]"}`}>
            <div className="text-center">
              <Film className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
              <p className={`${accentText} text-lg font-semibold`}>Streaming Not Available</p>
              <p className="text-[#9CA3AF] text-sm mt-1">
                This episode does not have a stream source yet.
              </p>
            </div>
          </div>
        )}

        {autoPlayCountdown !== null && nextEpisode && (
          <div className={`flex items-center justify-between mt-3 p-3 rounded-none border ${isPrime ? "bg-[#1A242D] border-[#2D3A45]" : "bg-[#0E1015] border-[#1F232D]"}`}>
            <p className="text-sm text-[#F9FAFB]">
              Next episode in <span className={`${accentText} font-bold`}>{autoPlayCountdown}s</span>
            </p>
            <div className="flex items-center gap-2">
              <button onClick={cancelAutoPlay} className="text-xs text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors">Cancel</button>
              <Link
                href={`${watchBasePath}/${item.slug}?season=${nextEpisode.seasonNumber}&episode=${nextEpisode.episodeNumber}${audio ? `&audio=${encodeURIComponent(audio)}` : ""}`}
                className={`text-xs ${accentText} hover:underline`}
              >
                Play now &rarr;
              </Link>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-4 gap-4">
          {prevEpisode ? (
            <Link
              href={`${watchBasePath}/${item.slug}?season=${prevEpisode.seasonNumber}&episode=${prevEpisode.episodeNumber}${audio ? `&audio=${encodeURIComponent(audio)}` : ""}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[#F9FAFB] transition-all text-sm ${isPrime ? "bg-[#1A242D] border-[#2D3A45] hover:border-[#00A8E1]/40" : "bg-[#0E1015] border-[#1F232D] hover:border-[#F5C542]/30"}`}
            >
              <ChevronLeft className="w-4 h-4" />
              {prevEpisode.episodeTitle}
            </Link>
          ) : (
            <div />
          )}
          {nextEpisode ? (
            <Link
              href={`${watchBasePath}/${item.slug}?season=${nextEpisode.seasonNumber}&episode=${nextEpisode.episodeNumber}${audio ? `&audio=${encodeURIComponent(audio)}` : ""}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[#F9FAFB] transition-all text-sm ${isPrime ? "bg-[#1A242D] border-[#2D3A45] hover:border-[#00A8E1]/40" : "bg-[#0E1015] border-[#1F232D] hover:border-[#F5C542]/30"}`}
            >
              {nextEpisode.episodeTitle}
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <div />
          )}
        </div>

        {seasons.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-[#F9FAFB] mb-4">Episodes</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {seasons.map((season) => (
                <div key={season.seasonNumber}>
                  <p className={`text-sm font-medium ${accentText} mb-2 mt-4 first:mt-0`}>
                    Season {season.seasonNumber}
                  </p>
                  {season.episodes.map((ep) => (
                    <Link
                      key={`${season.seasonNumber}-${ep.episodeNumber}`}
                      href={`${watchBasePath}/${item.slug}?season=${season.seasonNumber}&episode=${ep.episodeNumber}${audio ? `&audio=${encodeURIComponent(audio)}` : ""}`}
                      className={`flex items-center gap-3 p-3 border transition-all ${
                        currentSeason === season.seasonNumber &&
                        currentEpisodeNum === ep.episodeNumber
                          ? isPrime ? "bg-[#00A8E1]/10 border-[#00A8E1]" : "bg-[#F5C542]/10 border-[#F5C542]"
                          : isWatched(season.seasonNumber, ep.episodeNumber)
                          ? "bg-[#22C55E]/5 border-[#22C55E]/30"
                          : isPrime ? "bg-[#1A242D] border-[#2D3A45] hover:border-[#00A8E1]/40" : "bg-[#0E1015] border-[#1F232D] hover:border-[#F5C542]/30"
                      }`}
                    >
                      <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center text-xs ${
                        isWatched(season.seasonNumber, ep.episodeNumber)
                          ? "bg-[#22C55E]/20 text-[#22C55E]"
                          : "bg-[#1F232D] text-[#9CA3AF]"
                      }`}>
                        {isWatched(season.seasonNumber, ep.episodeNumber) ? <Check className="w-4 h-4" /> : ep.episodeNumber}
                      </span>
                      <span className="text-sm text-[#F9FAFB] truncate">
                        {ep.episodeTitle}
                      </span>
                      <span className="ml-auto text-xs text-[#9CA3AF]">
                        {ep.quality}
                      </span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

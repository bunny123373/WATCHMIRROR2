"use client";

import { useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Film, ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { addContinueWatching } from "@/store/slices/continueSlice";
import HLSPlayer from "@/components/HLSPlayer";
import IframePlayer from "@/components/IframePlayer";
import { IContent, Season } from "@/types";

interface SeriesWatchClientProps {
  item: IContent;
  currentEpisode: {
    episodeNumber: number;
    episodeTitle: string;
    hlsLink?: string;
    embedIframeLink?: string;
    quality: string;
  } | null;
  currentSeason: number;
  currentEpisodeNum: number;
  seasons: Season[];
}

export default function SeriesWatchClient({
  item,
  currentEpisode,
  currentSeason,
  currentEpisodeNum,
  seasons,
}: SeriesWatchClientProps) {
  const dispatch = useDispatch();

  const hasHls = !!currentEpisode?.hlsLink?.trim();
  const hasEmbed = !!currentEpisode?.embedIframeLink?.trim();
  const canStream = hasHls || hasEmbed;

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

  return (
    <main className="min-h-screen pt-16 pb-20 md:pb-0 bg-[#050608]">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-6">
        <Link
          href={`/series/${item.slug}`}
          className="inline-flex items-center gap-2 text-[#9CA3AF] hover:text-[#F5C542] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to series
        </Link>

        <h1 className="text-2xl font-bold text-[#F9FAFB] mb-2">{item.title}</h1>
        {currentEpisode && (
          <p className="text-[#9CA3AF] mb-4">
            Season {currentSeason} Episode {currentEpisode.episodeNumber} &mdash;{" "}
            {currentEpisode.episodeTitle}
          </p>
        )}

        {canStream ? (
          hasHls ? (
            <HLSPlayer src={currentEpisode!.hlsLink!} poster={item.banner} onProgress={saveProgress} />
          ) : (
            <IframePlayer src={currentEpisode!.embedIframeLink!} />
          )
        ) : (
          <div className="w-full aspect-video rounded-2xl bg-[#0E1015] border border-[#1F232D] flex items-center justify-center">
            <div className="text-center">
              <Film className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
              <p className="text-[#F5C542] text-lg font-semibold">Streaming Not Available</p>
              <p className="text-[#9CA3AF] text-sm mt-1">
                This episode does not have a stream source yet.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-4 gap-4">
          {prevEpisode ? (
            <Link
              href={`/series/watch/${item.slug}?season=${prevEpisode.seasonNumber}&episode=${prevEpisode.episodeNumber}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0E1015] border border-[#1F232D] text-[#F9FAFB] hover:border-[#F5C542]/30 transition-all text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              {prevEpisode.episodeTitle}
            </Link>
          ) : (
            <div />
          )}
          {nextEpisode ? (
            <Link
              href={`/series/watch/${item.slug}?season=${nextEpisode.seasonNumber}&episode=${nextEpisode.episodeNumber}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0E1015] border border-[#1F232D] text-[#F9FAFB] hover:border-[#F5C542]/30 transition-all text-sm"
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
                  <p className="text-sm font-medium text-[#F5C542] mb-2 mt-4 first:mt-0">
                    Season {season.seasonNumber}
                  </p>
                  {season.episodes.map((ep) => (
                    <Link
                      key={`${season.seasonNumber}-${ep.episodeNumber}`}
                      href={`/series/watch/${item.slug}?season=${season.seasonNumber}&episode=${ep.episodeNumber}`}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        currentSeason === season.seasonNumber &&
                        currentEpisodeNum === ep.episodeNumber
                          ? "bg-[#F5C542]/10 border-[#F5C542]"
                          : "bg-[#0E1015] border-[#1F232D] hover:border-[#F5C542]/30"
                      }`}
                    >
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#1F232D] flex items-center justify-center text-xs text-[#9CA3AF]">
                        {ep.episodeNumber}
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

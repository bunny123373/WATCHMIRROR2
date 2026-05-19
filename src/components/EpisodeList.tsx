"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { Episode } from "@/types";

interface EpisodeListProps {
  episodes: Episode[];
  slug: string;
  seasonNumber: number;
  audio?: string;
  banner?: string;
}

export default function EpisodeList({ episodes, slug, seasonNumber, audio, banner }: EpisodeListProps) {
  if (!episodes.length) {
    return (
      <div className="text-center py-8 text-[#9CA3AF]">
        No episodes available yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-thin pb-2 -mx-4 px-4">
      <div className="flex gap-3 min-w-max">
        {episodes.map((episode) => (
          <Link
            key={episode.episodeNumber}
            href={`/series/watch/${slug}?season=${seasonNumber}&episode=${episode.episodeNumber}${audio ? `&audio=${encodeURIComponent(audio)}` : ""}`}
            className="group flex-shrink-0 w-40 md:w-48"
          >
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-[#1F232D] border border-[#1F232D] group-hover:border-[#F5C542]/50 transition-all">
              {episode.thumbnail ? (
                <img src={episode.thumbnail} alt={episode.episodeTitle} className="w-full h-full object-cover" />
              ) : banner ? (
                <img src={banner} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1F232D] to-[#0E1015]">
                  <div className="text-center">
                    <Play className="w-8 h-8 text-[#9CA3AF] mx-auto mb-1" />
                    <span className="text-[10px] text-[#9CA3AF] font-mono block">E{episode.episodeNumber}</span>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-[#F5C542]/90 flex items-center justify-center group-hover:bg-[#F5C542] transition-colors">
                    <Play className="w-3 h-3 text-[#050608] ml-0.5" />
                  </div>
                  <span className="text-[10px] font-medium text-white">
                    E{episode.episodeNumber}
                  </span>
                  {episode.hlsLink && (
                    <span className="text-[8px] px-1 py-0.5 rounded bg-[#22C55E]/30 text-[#22C55E] font-medium ml-auto">
                      HD
                    </span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-xs text-[#F9FAFB] mt-1.5 truncate font-medium">
              {episode.episodeTitle}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

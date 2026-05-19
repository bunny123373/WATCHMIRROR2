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
  watchBasePath?: string;
  variant?: "default" | "prime";
}

export default function EpisodeList({ episodes, slug, seasonNumber, audio, banner, watchBasePath = "/series/watch", variant = "default" }: EpisodeListProps) {
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
            href={`${watchBasePath}/${slug}?season=${seasonNumber}&episode=${episode.episodeNumber}${audio ? `&audio=${encodeURIComponent(audio)}` : ""}`}
            className="group flex-shrink-0 w-40 md:w-48"
          >
            <div className={`relative aspect-[16/9] rounded-lg overflow-hidden bg-[#1F232D] border border-[#1F232D] transition-all ${variant === "prime" ? "group-hover:border-[#00A8E1]/50" : "group-hover:border-[#F5C542]/50"}`}>
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
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${variant === "prime" ? "bg-[#00A8E1]/90 group-hover:bg-[#00A8E1]" : "bg-[#F5C542]/90 group-hover:bg-[#F5C542]"}`}>
                    <Play className={`w-3 h-3 ml-0.5 ${variant === "prime" ? "text-white" : "text-[#050608]"}`} />
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

"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { Episode } from "@/types";

interface EpisodeListProps {
  episodes: Episode[];
  slug: string;
  seasonNumber: number;
  audio?: string;
}

export default function EpisodeList({ episodes, slug, seasonNumber, audio }: EpisodeListProps) {
  if (!episodes.length) {
    return (
      <div className="text-center py-8 text-[#9CA3AF]">
        No episodes available yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {episodes.map((episode) => (
        <Link
          key={episode.episodeNumber}
          href={`/series/watch/${slug}?season=${seasonNumber}&episode=${episode.episodeNumber}${audio ? `&audio=${encodeURIComponent(audio)}` : ""}`}
          className="flex items-center gap-4 p-4 rounded-xl bg-[#0E1015] border border-[#1F232D] hover:border-[#F5C542]/30 transition-all group"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#1F232D] flex items-center justify-center group-hover:bg-[#F5C542] transition-colors">
            <Play className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#050608] transition-colors" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#F5C542] font-medium">
                E{episode.episodeNumber}
              </span>
              <span className="text-[#9CA3AF] text-xs">{episode.quality}</span>
            </div>
            <p className="text-sm font-medium text-[#F9FAFB] truncate">
              {episode.episodeTitle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {episode.hlsLink && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#22C55E]/20 text-[#22C55E] font-medium">
                HD
              </span>
            )}
            <Play className="w-4 h-4 text-[#F5C542] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>
      ))}
    </div>
  );
}

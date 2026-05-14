"use client";

import { Season } from "@/types";

interface SeasonSelectorProps {
  seasons: Season[];
  selectedSeason: number;
  onSelect: (season: number) => void;
}

export default function SeasonSelector({ seasons, selectedSeason, onSelect }: SeasonSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
      {seasons.map((season) => (
        <button
          key={season.seasonNumber}
          onClick={() => onSelect(season.seasonNumber)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
            selectedSeason === season.seasonNumber
              ? "bg-[#F5C542] text-[#050608]"
              : "bg-[#0E1015] text-[#9CA3AF] border border-[#1F232D] hover:border-[#F5C542]/50"
          }`}
        >
          Season {season.seasonNumber}
        </button>
      ))}
    </div>
  );
}

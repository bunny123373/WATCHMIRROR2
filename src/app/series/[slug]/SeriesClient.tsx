"use client";

import { useState } from "react";
import { IContent } from "@/types";
import SeasonSelector from "@/components/SeasonSelector";
import EpisodeList from "@/components/EpisodeList";

const DEFAULT_DUBS = ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam"];

interface SeriesClientProps {
  item: IContent;
  watchBasePath?: string;
  variant?: "default" | "prime";
}

export default function SeriesClient({ item, watchBasePath = "/series/watch", variant = "default" }: SeriesClientProps) {
  const [selectedSeason, setSelectedSeason] = useState(
    item.seasons?.[0]?.seasonNumber || 1
  );

  const allAudio = [...(item.audioAvailable || [])];
  if (item.dubLanguage) {
    item.dubLanguage.forEach((dl) => {
      if (!allAudio.includes(dl)) allAudio.push(dl);
    });
  }
  if (allAudio.length === 0 && (item.peachifyId || item.tmdbId)) {
    allAudio.push(...DEFAULT_DUBS);
  }

  const [selectedAudio, setSelectedAudio] = useState(allAudio[0] || "");

  if (!item.seasons?.length) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold text-[#F9FAFB] mb-4">Episodes</h2>
        <p className="text-[#9CA3AF]">No episodes available yet.</p>
      </div>
    );
  }

  const currentSeason = item.seasons.find(
    (s) => s.seasonNumber === selectedSeason
  );

  return (
    <div className={`mt-8 p-4 md:p-6 rounded-xl border ${variant === "prime" ? "border-[#2D3A45] bg-[#1A242D]" : "border-[#1F232D] bg-[#0E1015]"}`}>
      <h2 className="text-xl md:text-2xl font-bold text-[#F9FAFB] mb-4">
        Episodes
      </h2>

      {allAudio.length > 0 && (
        <div className="mb-4">
                          <p className="text-xs text-[#9CA3AF] mb-2 font-medium">Select Audio Language</p>
          <div className="flex flex-wrap gap-2">
            {allAudio.map((audio) => (
              <button
                key={audio}
                onClick={() => setSelectedAudio(audio)}
                className={`px-3 py-1.5 rounded-none text-xs font-medium border transition-all ${
                  selectedAudio === audio
                    ? variant === "prime" ? "bg-[#00A8E1] text-white border-[#00A8E1]" : "bg-[#F5C542] text-[#050608] border-[#F5C542]"
                    : variant === "prime" ? "bg-[#0F171E] text-[#8197A4] border-[#2D3A45] hover:border-[#00A8E1]/50" : "bg-[#050608] text-[#9CA3AF] border-[#1F232D] hover:border-[#F5C542]/50"
                }`}
              >
                {audio}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        <SeasonSelector
          seasons={item.seasons}
          selectedSeason={selectedSeason}
          onSelect={setSelectedSeason}
        />
      </div>
      <div className="mt-4">
        <EpisodeList
          episodes={currentSeason?.episodes || []}
          slug={item.slug}
          seasonNumber={selectedSeason}
          audio={selectedAudio}
          banner={item.banner}
          watchBasePath={watchBasePath}
          variant={variant}
        />
      </div>
    </div>
  );
}

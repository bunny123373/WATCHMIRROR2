"use client";

import { useState } from "react";
import { IContent } from "@/types";
import SeasonSelector from "@/components/SeasonSelector";
import EpisodeList from "@/components/EpisodeList";

const DEFAULT_DUBS = ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam"];

interface SeriesClientProps {
  item: IContent;
}

export default function SeriesClient({ item }: SeriesClientProps) {
  const [selectedSeason, setSelectedSeason] = useState(
    item.seasons?.[0]?.seasonNumber || 1
  );

  const allAudio = [...(item.audioAvailable || [])];
  if (item.dubLanguage) {
    item.dubLanguage.forEach((dl) => {
      if (!allAudio.includes(dl)) allAudio.push(dl);
    });
  }
  if (allAudio.length === 0 && item.peachifyId) {
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
    <div className="mt-8">
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
                    ? "bg-[#F5C542] text-[#050608] border-[#F5C542]"
                    : "bg-[#050608] text-[#9CA3AF] border-[#1F232D] hover:border-[#F5C542]/50"
                }`}
              >
                {audio}
              </button>
            ))}
          </div>
        </div>
      )}

      <SeasonSelector
        seasons={item.seasons}
        selectedSeason={selectedSeason}
        onSelect={setSelectedSeason}
      />
      <div className="mt-4">
        <EpisodeList
          episodes={currentSeason?.episodes || []}
          slug={item.slug}
          seasonNumber={selectedSeason}
          audio={selectedAudio}
        />
      </div>
    </div>
  );
}

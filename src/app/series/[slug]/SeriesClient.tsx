"use client";

import { useState } from "react";
import { IContent } from "@/types";
import SeasonSelector from "@/components/SeasonSelector";
import EpisodeList from "@/components/EpisodeList";

interface SeriesClientProps {
  item: IContent;
}

export default function SeriesClient({ item }: SeriesClientProps) {
  const [selectedSeason, setSelectedSeason] = useState(
    item.seasons?.[0]?.seasonNumber || 1
  );

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
        />
      </div>
    </div>
  );
}

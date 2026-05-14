"use client";

import { useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";

interface AudioSelectorProps {
  slug: string;
  audioAvailable?: string[];
  dubLanguage?: string[];
}

export default function AudioSelector({ slug, audioAvailable, dubLanguage }: AudioSelectorProps) {
  const [selectedAudio, setSelectedAudio] = useState(audioAvailable?.[0] || "");

  const allAudio = [...(audioAvailable || [])];
  if (dubLanguage) {
    dubLanguage.forEach((dl) => {
      if (!allAudio.includes(dl)) allAudio.push(dl);
    });
  }

  if (allAudio.length === 0) {
    return (
      <Link
        href={`/watch/${slug}`}
        className="inline-flex items-center gap-2 px-8 py-3 rounded-none gold-gradient text-[#050608] font-semibold hover:opacity-90 transition-opacity text-lg"
      >
        <Play className="w-5 h-5" />
        Watch Now
      </Link>
    );
  }

  return (
    <div className="space-y-3">
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
      <Link
        href={`/watch/${slug}?audio=${encodeURIComponent(selectedAudio)}`}
        className="inline-flex items-center gap-2 px-8 py-3 rounded-none gold-gradient text-[#050608] font-semibold hover:opacity-90 transition-opacity text-lg"
      >
        <Play className="w-5 h-5" />
        Watch Now
      </Link>
    </div>
  );
}

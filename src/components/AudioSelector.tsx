"use client";

import { useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { ContentStream } from "@/types";
import DownloadButton from "@/components/DownloadButton";

interface AudioSelectorProps {
  slug: string;
  streams?: ContentStream[];
  audioAvailable?: string[];
  dubLanguage?: string[];
}

export default function AudioSelector({ slug, streams, audioAvailable, dubLanguage }: AudioSelectorProps) {
  const allLanguages = streams && streams.length > 0
    ? streams.map((s) => s.language)
    : (() => {
        const list = [...(audioAvailable || [])];
        if (dubLanguage) {
          dubLanguage.forEach((dl) => {
            if (!list.includes(dl)) list.push(dl);
          });
        }
        return list;
      })();

  const [selectedAudio, setSelectedAudio] = useState(allLanguages[0] || "");

  if (allLanguages.length === 0) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href={`/watch/${slug}`}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-none gold-gradient text-[#050608] font-semibold hover:opacity-90 transition-opacity text-lg"
        >
          <Play className="w-5 h-5" />
          Watch Now
        </Link>
        <DownloadButton slug={slug} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-[#9CA3AF] font-medium">Select Audio Language</p>
      <div className="flex flex-wrap gap-2">
        {allLanguages.map((lang) => (
          <button
            key={lang}
            onClick={() => setSelectedAudio(lang)}
            className={`px-3 py-1.5 rounded-none text-xs font-medium border transition-all ${
              selectedAudio === lang
                ? "bg-[#F5C542] text-[#050608] border-[#F5C542]"
                : "bg-[#050608] text-[#9CA3AF] border-[#1F232D] hover:border-[#F5C542]/50"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Link
          href={`/watch/${slug}?audio=${encodeURIComponent(selectedAudio)}`}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-none gold-gradient text-[#050608] font-semibold hover:opacity-90 transition-opacity text-lg"
        >
          <Play className="w-5 h-5" />
          Watch Now
        </Link>
        <DownloadButton slug={slug} />
      </div>
    </div>
  );
}

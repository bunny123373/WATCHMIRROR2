"use client";

import { useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { ContentStream } from "@/types";
import DownloadButton from "@/components/DownloadButton";

const DEFAULT_DUBS = ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam"];

interface AudioSelectorProps {
  slug: string;
  streams?: ContentStream[];
  audioAvailable?: string[];
  dubLanguage?: string[];
  hasPeachify?: boolean;
  watchBasePath?: string;
  variant?: "default" | "prime";
}

export default function AudioSelector({ slug, streams, audioAvailable, dubLanguage, hasPeachify, watchBasePath = "/watch", variant = "default" }: AudioSelectorProps) {
  const allLanguages = streams && streams.length > 0
    ? streams.map((s) => s.language)
    : (() => {
        const fromAdmin = [...(audioAvailable || [])];
        if (dubLanguage) {
          dubLanguage.forEach((dl) => {
            if (!fromAdmin.includes(dl)) fromAdmin.push(dl);
          });
        }
        if (fromAdmin.length > 0) return fromAdmin;
        if (hasPeachify) return DEFAULT_DUBS;
        return [];
      })();

  const [selectedAudio, setSelectedAudio] = useState(allLanguages[0] || "");
  const watchHref = `${watchBasePath}/${slug}`;
  const buttonClass = variant === "prime"
    ? "inline-flex items-center gap-2 px-8 py-3 rounded-none bg-[#00A8E1] text-white font-semibold hover:bg-[#00A8E1]/80 transition-opacity text-lg"
    : "inline-flex items-center gap-2 px-8 py-3 rounded-none gold-gradient text-[#050608] font-semibold hover:opacity-90 transition-opacity text-lg";
  const activeClass = variant === "prime"
    ? "bg-[#00A8E1] text-white border-[#00A8E1]"
    : "bg-[#F5C542] text-[#050608] border-[#F5C542]";
  const idleClass = variant === "prime"
    ? "bg-[#0F171E] text-[#8197A4] border-[#2D3A45] hover:border-[#00A8E1]/50"
    : "bg-[#050608] text-[#9CA3AF] border-[#1F232D] hover:border-[#F5C542]/50";

  if (allLanguages.length === 0) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href={watchHref}
          className={buttonClass}
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
              selectedAudio === lang ? activeClass : idleClass
            }`}
          >
            {lang}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Link
          href={`${watchHref}?audio=${encodeURIComponent(selectedAudio)}`}
          className={buttonClass}
        >
          <Play className="w-5 h-5" />
          Watch Now
        </Link>
        <DownloadButton slug={slug} />
      </div>
    </div>
  );
}

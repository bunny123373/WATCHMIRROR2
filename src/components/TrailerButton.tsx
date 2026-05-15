"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";

interface Props {
  url: string;
}

export default function TrailerButton({ url }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-5 h-10 rounded-none gold-gradient text-[#050608] font-semibold hover:opacity-90 transition-opacity text-sm"
      >
        <Play className="w-4 h-4 fill-current" />
        Watch Trailer
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] bg-[#050608]/90 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-[#0E1015] border border-[#1F232D]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-10 right-0 p-2 text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src={url}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title="Trailer"
            />
          </div>
        </div>
      )}
    </>
  );
}

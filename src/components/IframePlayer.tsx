"use client";

import { useMemo } from "react";

interface IframePlayerProps {
  src: string;
}

export default function IframePlayer({ src }: IframePlayerProps) {
  const finalSrc = useMemo(() => {
    if (src.includes("abyssplayer.com")) {
      const id = src.split("/").pop();
      if (id) return `/api/abyss/proxy?id=${id}`;
    }
    return src;
  }, [src]);

  return (
    <div className="relative w-full aspect-video rounded-2xl bg-[#0E1015] border border-[#1F232D] overflow-hidden">
      <iframe
        src={finalSrc}
        className="absolute inset-0 w-full h-full"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        loading="lazy"
        referrerPolicy="no-referrer"
        title="Video Player"
      />
    </div>
  );
}

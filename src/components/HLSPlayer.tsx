"use client";

import MuxPlayer from "@mux/mux-player-react";

interface HLSPlayerProps {
  src: string;
  poster?: string;
  subtitleUrl?: string;
  subtitleLang?: string;
  onProgress?: (currentTime: number, duration: number) => void;
}

export default function HLSPlayer({ src, poster, subtitleUrl, subtitleLang, onProgress }: HLSPlayerProps) {
  if (!src?.trim()) {
    return (
      <div className="w-full aspect-video rounded-none bg-[#0E1015] border border-[#1F232D] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#F5C542] text-lg font-semibold">Stream Error</p>
          <p className="text-[#9CA3AF] text-sm mt-1">Unable to load stream</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-none bg-[#0E1015] border border-[#1F232D] overflow-hidden">
      <MuxPlayer
        src={src}
        poster={poster}
        streamType="on-demand"
        {...{ "audio-track-button": true } as any}
        style={{ width: "100%", height: "100%" }}
        className="w-full h-full object-contain"
        onTimeUpdate={(evt: any) => {
          if (onProgress) {
            onProgress(evt.target.currentTime, evt.target.duration);
          }
        }}
      >
        {subtitleUrl && (
          <track
            kind="subtitles"
            src={subtitleUrl}
            srcLang={subtitleLang || "en"}
            label={subtitleLang || "Subtitles"}
            default
          />
        )}
      </MuxPlayer>
    </div>
  );
}

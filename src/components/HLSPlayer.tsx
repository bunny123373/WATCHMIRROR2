"use client";

import { useMemo } from "react";
import MuxPlayer from "@mux/mux-player-react";
import "@mux/mux-player/themes/classic";

interface HLSPlayerProps {
  src: string;
  poster?: string;
  subtitleUrl?: string;
  subtitleLang?: string;
  onProgress?: (currentTime: number, duration: number) => void;
}

const MUX_PATTERN = /stream\.mux\.com\/([a-zA-Z0-9]+)/;

export default function HLSPlayer({ src, poster, subtitleUrl, subtitleLang, onProgress }: HLSPlayerProps) {
  const muxPlaybackId = useMemo(() => {
    const match = src?.match(MUX_PATTERN);
    return match ? match[1] : null;
  }, [src]);

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
    <div className="relative w-full bg-[#0E1015] border border-[#1F232D]">
      <MuxPlayer
        {...(muxPlaybackId ? { playbackId: muxPlaybackId } : { src })}
        poster={poster}
        streamType="on-demand"
        theme="classic"
        autoPlay="any"
        {...{ "audio-track-button": true } as any}
        style={{ aspectRatio: "16/9", width: "100%", height: "auto" }}
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

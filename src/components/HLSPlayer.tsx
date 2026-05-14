"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface HLSPlayerProps {
  src: string;
  poster?: string;
}

export default function HLSPlayer({ src, poster }: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src || !src.trim()) {
      setLoading(false);
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        video.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          setError(true);
          setLoading(false);
        }
      });
      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        setLoading(false);
        video.play().catch(() => {});
      });
      video.addEventListener("error", () => {
        setError(true);
        setLoading(false);
      });
      return () => {
        video.removeEventListener("loadedmetadata", () => {});
        video.removeEventListener("error", () => {});
      };
    } else {
      setError(true);
      setLoading(false);
    }
  }, [src]);

  if (error) {
    return (
      <div className="w-full aspect-video rounded-2xl bg-[#0E1015] border border-[#1F232D] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#F5C542] text-lg font-semibold">Stream Error</p>
          <p className="text-[#9CA3AF] text-sm mt-1">Unable to load stream</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-2xl bg-[#0E1015] border border-[#1F232D] overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0E1015] z-10">
          <div className="w-10 h-10 border-2 border-[#F5C542] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={poster}
        controls
        playsInline
      />
    </div>
  );
}

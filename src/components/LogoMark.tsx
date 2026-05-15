"use client";

import { useId } from "react";

interface WatchMirrorLogoProps {
  width?: number;
  height?: number;
}

export function WatchMirrorLogo({ width = 70, height = 70 }: WatchMirrorLogoProps) {
  const id = useId();

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`wm-gradient-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="45%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>

        <filter id={`wm-glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d="M8 15 L28 92 C30 102 42 102 45 92 L58 42"
        stroke={`url(#wm-gradient-${id})`}
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#wm-glow-${id})`}
      />

      <path
        d="M58 42 L72 92 C75 102 87 102 89 92 L110 15"
        stroke={`url(#wm-gradient-${id})`}
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#wm-glow-${id})`}
      />

      <path
        d="M60 25 L80 92"
        stroke="#4C1D95"
        strokeOpacity="0.35"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  );
}

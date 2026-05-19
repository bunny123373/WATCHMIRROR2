"use client";

interface IframePlayerProps {
  src: string;
}

export default function IframePlayer({ src }: IframePlayerProps) {
  return (
    <div className="relative w-full aspect-video rounded-2xl bg-[#0E1015] border border-[#1F232D] overflow-hidden">
      <iframe
        src={src}
        className="absolute inset-0 w-full h-full"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-presentation"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        loading="lazy"
        referrerPolicy="no-referrer"
        title="Video Player"
      />
    </div>
  );
}

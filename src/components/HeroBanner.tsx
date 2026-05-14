"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Info } from "lucide-react";
import { IContent } from "@/types";

interface HeroBannerProps {
  items: IContent[];
}

export default function HeroBanner({ items }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const featured = items.slice(0, 5);

  useEffect(() => {
    if (featured.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featured.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featured.length]);

  if (!featured.length) return null;

  const item = featured[current];

  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] min-h-[400px]">
      {item.banner && (
        <Image
          src={item.banner}
          alt={item.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050608]/80 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 pb-24 md:pb-32">
        <div className="max-w-[1800px] mx-auto">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-[#F5C542] text-[#050608]">
                {item.quality}
              </span>
              <span className="text-sm text-[#F5C542]">★ {item.rating?.toFixed(1)}</span>
              <span className="text-sm text-[#9CA3AF]">{item.year}</span>
              <span className="text-sm text-[#9CA3AF] capitalize">{item.category}</span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#F9FAFB] mb-3">
              {item.title}
            </h1>
            <p className="text-sm md:text-base text-[#9CA3AF] line-clamp-2 md:line-clamp-3 mb-6">
              {item.description}
            </p>
            <div className="flex items-center gap-3">
              <Link
                href={item.type === "movie" ? `/watch/${item.slug}` : `/series/${item.slug}`}
                className="flex items-center gap-2 px-6 py-3 rounded-none gold-gradient text-[#050608] font-semibold hover:opacity-90 transition-opacity"
              >
                <Play className="w-5 h-5" />
                {item.type === "movie" ? "Watch Now" : "View Series"}
              </Link>
              <Link
                href={item.type === "movie" ? `/movie/${item.slug}` : `/series/${item.slug}`}
                className="flex items-center gap-2 px-6 py-3 rounded-none bg-[#1F232D]/80 text-[#F9FAFB] font-medium hover:bg-[#1F232D] transition-colors"
              >
                <Info className="w-5 h-5" />
                Details
              </Link>
            </div>
          </div>
        </div>
      </div>

      {featured.length > 1 && (
        <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 flex gap-2">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current ? "w-6 bg-[#F5C542]" : "bg-[#9CA3AF]/50 hover:bg-[#9CA3AF]"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

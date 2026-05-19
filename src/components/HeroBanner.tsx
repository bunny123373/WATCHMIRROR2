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
    <div className="relative w-full min-h-[280px] sm:min-h-[380px] md:h-[90vh] lg:h-[100vh] md:min-h-[500px]">
      {item.banner && (
        <Image
          src={item.banner}
          alt={item.title}
          fill
          className="object-cover bg-[#050608]"
          priority
          sizes="100vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/40 via-60% to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050608]/80 via-[#050608]/40 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-8 pb-3 sm:pb-4 md:pb-16">
        <div className="max-w-[1800px] mx-auto">
          <div className="max-w-2xl">
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-2 md:mb-3">
              <span className="px-1.5 py-0.5 md:px-2 md:py-1 text-[10px] md:text-xs font-semibold bg-[#F5C542] text-[#050608]">
                {item.quality}
              </span>
              <span className="text-[11px] md:text-sm text-[#F5C542]">★ {item.rating?.toFixed(1)}</span>
              <span className="text-[11px] md:text-sm text-[#9CA3AF]">{item.year}</span>
              <span className="text-[11px] md:text-sm text-[#9CA3AF] capitalize hidden xs:inline">{item.category}</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-5xl lg:text-6xl font-bold text-[#F9FAFB] mb-1.5 md:mb-3 leading-tight">
              {item.title}
            </h1>
            <p className="hidden sm:block text-xs sm:text-sm md:text-base text-[#9CA3AF] line-clamp-2 md:line-clamp-3 mb-3 md:mb-6">
              {item.description}
            </p>
            <div className="flex items-center gap-2 md:gap-3">
              <Link
                href={item.type === "movie" ? `/watch/${item.slug}` : `/series/${item.slug}`}
                className="flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-6 md:py-3 rounded-none gold-gradient text-[#050608] font-semibold hover:opacity-90 transition-opacity text-xs md:text-base"
              >
                <Play className="w-3.5 h-3.5 md:w-5 md:h-5" />
                {item.type === "movie" ? "Watch Now" : "View Series"}
              </Link>
              <Link
                href={item.type === "movie" ? `/movie/${item.slug}` : `/series/${item.slug}`}
                className="flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-6 md:py-3 rounded-none bg-[#1F232D]/80 text-[#F9FAFB] font-medium hover:bg-[#1F232D] transition-colors text-xs md:text-base"
              >
                <Info className="w-3.5 h-3.5 md:w-5 md:h-5" />
                Details
              </Link>
            </div>
          </div>
        </div>
      </div>

      {featured.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-8 right-3 sm:right-4 md:right-8 flex gap-1.5 md:gap-2">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${
                i === current
                  ? "w-4 md:w-6 h-1.5 md:h-2 bg-[#F5C542]"
                  : "w-1.5 md:w-2 h-1.5 md:h-2 bg-[#9CA3AF]/50 hover:bg-[#9CA3AF]"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

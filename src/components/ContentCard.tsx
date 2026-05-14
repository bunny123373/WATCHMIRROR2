"use client";

import Link from "next/link";
import Image from "next/image";
import { IContent } from "@/types";
import { TMDB_IMAGE_W500 } from "@/lib/constants";

interface ContentCardProps {
  item: IContent;
}

export default function ContentCard({ item }: ContentCardProps) {
  const href = item.type === "movie" ? `/movie/${item.slug}` : `/series/${item.slug}`;

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[2/3] rounded-none overflow-hidden bg-[#0E1015] border border-[#1F232D] card-hover">
        <Image
          src={item.poster || `${TMDB_IMAGE_W500}/placeholder.svg`}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-2 right-2">
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#F5C542] text-[#050608]">
            {item.quality || "HD"}
          </span>
        </div>
        {item.rating > 0 && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#050608]/80 text-[#F5C542] border border-[#F5C542]/30">
              ★ {item.rating.toFixed(1)}
            </span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300" />
      </div>
    </Link>
  );
}

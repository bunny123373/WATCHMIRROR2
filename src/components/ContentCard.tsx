"use client";

import Link from "next/link";
import Image from "next/image";
import { IContent } from "@/types";
import { TMDB_IMAGE_W500 } from "@/lib/constants";
import MaturityGate from "./MaturityGate";

interface ContentCardProps {
  item: IContent;
}

export default function ContentCard({ item }: ContentCardProps) {
  const href = item.primeVideo
    ? item.type === "movie" ? `/prime-video/movie/${item.slug}` : `/prime-video/series/${item.slug}`
    : item.type === "movie" ? `/movie/${item.slug}` : `/series/${item.slug}`;

  return (
    <Link href={href} className="group block">
      <MaturityGate contentRating={item.contentRating}>
      <div className="relative aspect-[2/3] rounded-none overflow-hidden bg-[#0E1015] border border-[#1F232D] card-hover">
        <Image
          src={item.poster || `${TMDB_IMAGE_W500}/placeholder.svg`}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      </MaturityGate>
    </Link>
  );
}

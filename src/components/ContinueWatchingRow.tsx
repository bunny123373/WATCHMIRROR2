"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { RootState } from "@/store/store";
import { setContinueWatching } from "@/store/slices/continueSlice";
import { ContinueWatchingItem } from "@/types";
import { TMDB_IMAGE_W500 } from "@/lib/constants";

export default function ContinueWatchingRow() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.continue.items);

  useEffect(() => {
    const stored = localStorage.getItem("watchmirror_continue_watching");
    if (stored) {
      try {
        dispatch(setContinueWatching(JSON.parse(stored)));
      } catch {}
    }
  }, [dispatch]);

  if (!items.length) return null;

  return (
    <section>
      <h2 className="text-xl md:text-2xl font-bold text-[#F9FAFB] mb-4 px-4 md:px-8">
        Continue Watching
      </h2>
      <div className="flex gap-3 overflow-x-auto px-4 md:px-8 pb-2" style={{ scrollbarWidth: "none" }}>
        {items.map((item) => (
          <ContinueCard key={`${item.slug}-${item.episodeNumber || 0}`} item={item} />
        ))}
      </div>
    </section>
  );
}

function ContinueCard({ item }: { item: ContinueWatchingItem }) {
  const href = item.type === "movie"
    ? `/watch/${item.slug}`
    : `/series/watch/${item.slug}?season=${item.seasonNumber}&episode=${item.episodeNumber}`;

  const progress = item.duration > 0 ? (item.currentTime / item.duration) * 100 : 0;

  return (
    <Link href={href} className="flex-shrink-0 w-36 sm:w-44 group">
      <div className="relative aspect-[2/3] rounded-none overflow-hidden bg-[#0E1015] border border-[#1F232D]">
        <Image
          src={item.poster || `${TMDB_IMAGE_W500}/placeholder.svg`}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="160px"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#050608] to-transparent p-3 pt-8">
          {item.episodeNumber && (
            <p className="text-[10px] text-[#9CA3AF]">S{item.seasonNumber} E{item.episodeNumber}</p>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1F232D]">
          <div
            className="h-full bg-[#F5C542] transition-all"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </Link>
  );
}

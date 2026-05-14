"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { RootState } from "@/store/store";
import { setMyList } from "@/store/slices/myListSlice";
import { Bookmark } from "lucide-react";
import { TMDB_IMAGE_W500 } from "@/lib/constants";

export default function MyListRow() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.myList.items);

  useEffect(() => {
    const stored = localStorage.getItem("watchmirror_mylist");
    if (stored) {
      try { dispatch(setMyList(JSON.parse(stored))); } catch {}
    }
  }, [dispatch]);

  if (!items.length) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4 px-4 md:px-8">
        <h2 className="text-xl md:text-2xl font-bold text-[#F9FAFB]">My List</h2>
        <Link href="/my-list" className="text-sm text-[#F5C542] hover:text-[#D4A831] transition-colors">
          View All
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 md:px-8 pb-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {items.map((item) => (
          <Link
            key={item.slug}
            href={item.type === "movie" ? `/movie/${item.slug}` : `/series/${item.slug}`}
            className="flex-shrink-0 w-[120px] sm:w-[140px] md:w-[160px] group"
          >
            <div className="relative aspect-[2/3] rounded-none overflow-hidden bg-[#0E1015] border border-[#1F232D]">
              <Image
                src={item.poster || `${TMDB_IMAGE_W500}/placeholder.svg`}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="160px"
              />
            </div>
            <p className="text-xs text-[#F9FAFB] truncate mt-1.5">{item.title}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

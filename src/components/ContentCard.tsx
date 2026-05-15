"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setMyList, addToList, removeFromList } from "@/store/slices/myListSlice";
import { Bookmark } from "lucide-react";
import { IContent } from "@/types";
import { TMDB_IMAGE_W500 } from "@/lib/constants";
import MaturityGate from "./MaturityGate";

interface ContentCardProps {
  item: IContent;
}

export default function ContentCard({ item }: ContentCardProps) {
  const dispatch = useDispatch();
  const listItems = useSelector((state: RootState) => state.myList.items);
  const saved = listItems.some((i) => i.slug === item.slug);

  useEffect(() => {
    const stored = localStorage.getItem("watchmirror_mylist");
    if (stored) {
      try { dispatch(setMyList(JSON.parse(stored))); } catch {}
    }
  }, [dispatch]);

  const toggleSave = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const entry = { slug: item.slug, type: item.type as "movie" | "series", title: item.title, poster: item.poster, year: item.year, quality: item.quality };
    if (saved) {
      dispatch(removeFromList(item.slug));
      const updated = listItems.filter((i) => i.slug !== item.slug);
      localStorage.setItem("watchmirror_mylist", JSON.stringify(updated));
    } else {
      dispatch(addToList(entry));
      const updated = [entry, ...listItems];
      localStorage.setItem("watchmirror_mylist", JSON.stringify(updated));
    }
  }, [dispatch, saved, listItems, item]);

  const href = item.type === "movie" ? `/movie/${item.slug}` : `/series/${item.slug}`;

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
        {item.contentRating && (
          <div className="absolute top-2 left-2">
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#050608]/90 text-[#F5C542] border border-[#F5C542]/30">
              {item.contentRating}
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <button onClick={toggleSave} className={`p-1.5 rounded text-[10px] transition-all ${
            saved ? "bg-[#F5C542] text-[#050608]" : "bg-[#050608]/80 text-[#9CA3AF] hover:text-[#F5C542]"
          }`} title={saved ? "Remove" : "Save"}>
            <Bookmark className="w-3 h-3" fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300" />
      </div>
      </MaturityGate>
    </Link>
  );
}

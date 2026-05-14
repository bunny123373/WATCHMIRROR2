"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setMyList, addToList, removeFromList } from "@/store/slices/myListSlice";
import { Bookmark } from "lucide-react";

interface SaveButtonProps {
  slug: string;
  type: "movie" | "series";
  title: string;
  poster: string;
  year?: number;
  quality?: string;
  className?: string;
}

export default function SaveButton({ slug, type, title, poster, year, quality, className = "" }: SaveButtonProps) {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.myList.items);
  const saved = items.some((i) => i.slug === slug);

  useEffect(() => {
    const stored = localStorage.getItem("watchmirror_mylist");
    if (stored) {
      try { dispatch(setMyList(JSON.parse(stored))); } catch {}
    }
  }, [dispatch]);

  const toggle = () => {
    if (saved) {
      dispatch(removeFromList(slug));
      const updated = items.filter((i) => i.slug !== slug);
      localStorage.setItem("watchmirror_mylist", JSON.stringify(updated));
    } else {
      dispatch(addToList({ slug, type, title, poster, year, quality }));
      const updated = [{ slug, type, title, poster, year, quality }, ...items];
      localStorage.setItem("watchmirror_mylist", JSON.stringify(updated));
    }
  };

  return (
    <button onClick={toggle} className={`p-2 rounded-lg transition-all ${
      saved
        ? "bg-[#F5C542] text-[#050608]"
        : "bg-[#1F232D] text-[#9CA3AF] hover:text-[#F5C542] hover:bg-[#F5C542]/10"
    } ${className}`} title={saved ? "Remove from My List" : "Add to My List"}>
      <Bookmark className="w-4 h-4" fill={saved ? "currentColor" : "none"} />
    </button>
  );
}

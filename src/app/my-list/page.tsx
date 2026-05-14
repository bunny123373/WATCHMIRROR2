"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { RootState } from "@/store/store";
import { setMyList, removeFromList } from "@/store/slices/myListSlice";
import { Bookmark, Trash2, Film, Monitor } from "lucide-react";
import { TMDB_IMAGE_W500 } from "@/lib/constants";

export default function MyListPage() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.myList.items);

  useEffect(() => {
    const stored = localStorage.getItem("watchmirror_mylist");
    if (stored) {
      try { dispatch(setMyList(JSON.parse(stored))); } catch {}
    }
  }, [dispatch]);

  const handleRemove = (slug: string) => {
    dispatch(removeFromList(slug));
    const updated = items.filter((i) => i.slug !== slug);
    localStorage.setItem("watchmirror_mylist", JSON.stringify(updated));
  };

  return (
    <main className="min-h-screen pt-14 md:pt-16 pb-20 md:pb-0">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Bookmark className="w-6 h-6 text-[#F5C542]" />
          <h1 className="text-3xl md:text-4xl font-bold text-[#F9FAFB]">My List</h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <Bookmark className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
            <p className="text-[#9CA3AF] text-lg">Your list is empty</p>
            <p className="text-[#9CA3AF] text-sm mt-1">Save movies and series to watch later.</p>
            <Link href="/" className="inline-block mt-4 px-6 py-2 rounded-none gold-gradient text-[#050608] font-semibold">
              Browse Content
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {items.map((item) => (
              <div key={item.slug} className="w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] group relative">
                <Link href={item.type === "movie" ? `/movie/${item.slug}` : `/series/${item.slug}`}>
                  <div className="relative aspect-[2/3] rounded-none overflow-hidden bg-[#0E1015] border border-[#1F232D]">
                    <Image
                      src={item.poster || `${TMDB_IMAGE_W500}/placeholder.svg`}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
                <button onClick={() => handleRemove(item.slug)} className="absolute top-2 right-2 p-1.5 rounded bg-red-400/20 text-red-400 hover:bg-red-400/40 transition-colors z-10">
                  <Trash2 className="w-3 h-3" />
                </button>
                <div className="flex items-center gap-1 mt-1.5">
                  {item.type === "movie" ? <Film className="w-3 h-3 text-[#8B5CF6]" /> : <Monitor className="w-3 h-3 text-[#22C55E]" />}
                  <p className="text-xs text-[#F9FAFB] truncate flex-1">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

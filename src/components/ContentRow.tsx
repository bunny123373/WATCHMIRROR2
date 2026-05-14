"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IContent } from "@/types";
import ContentCard from "./ContentCard";

interface ContentRowProps {
  title: string;
  items: IContent[];
  viewAllHref?: string;
}

export default function ContentRow({ title, items, viewAllHref }: ContentRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!rowRef.current) return;
    const scrollAmount = rowRef.current.clientWidth;
    rowRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!items.length) return null;

  return (
    <section className="relative">
      <div className="flex items-center justify-between mb-4 px-4 md:px-8">
        <h2 className="text-xl md:text-2xl font-bold text-[#F9FAFB]">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-sm text-[#F5C542] hover:text-[#D4A831] transition-colors"
          >
            View All
          </Link>
        )}
      </div>
      <div className="relative group">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 md:w-16 bg-gradient-to-r from-[#050608] to-transparent flex items-center justify-start pl-2 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 text-[#F9FAFB]" />
        </button>
        <div
          ref={rowRef}
          className="flex gap-3 overflow-x-auto scroll-smooth px-4 md:px-8 pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => (
            <div key={item.slug} className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px]">
              <ContentCard item={item} />
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 md:w-16 bg-gradient-to-l from-[#050608] to-transparent flex items-center justify-end pr-2 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-[#F9FAFB]" />
        </button>
      </div>
    </section>
  );
}

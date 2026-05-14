import Link from "next/link";
import Image from "next/image";
import { IContent } from "@/types";
import { TMDB_IMAGE_W500 } from "@/lib/constants";

interface TrendingRowProps {
  title: string;
  items: IContent[];
  viewAllHref?: string;
}

export default function TrendingRow({ title, items, viewAllHref }: TrendingRowProps) {
  if (!items.length) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4 px-4 md:px-8">
        <h2 className="text-xl md:text-2xl font-bold text-[#F9FAFB]">{title}</h2>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-sm text-[#F5C542] hover:text-[#D4A831] transition-colors">
            View All
          </Link>
        )}
      </div>
      <div className="flex gap-2 md:gap-4 overflow-x-auto px-4 md:px-8 pb-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {items.slice(0, 10).map((item, i) => (
          <Link
            key={item.slug}
            href={item.type === "movie" ? `/movie/${item.slug}` : `/series/${item.slug}`}
            className="flex-shrink-0 group relative"
          >
            <div className="relative pl-10 md:pl-16">
              <span className="text-8xl md:text-9xl lg:text-[10rem] font-extrabold text-[#1F232D] [-webkit-text-stroke:2px_#F5C542] leading-none absolute left-0 top-1/2 -translate-y-1/2 select-none z-0">
                {i + 1}
              </span>
              <div className="relative w-[90px] sm:w-[110px] md:w-[130px] aspect-[2/3] rounded-none overflow-hidden bg-[#0E1015] border border-[#1F232D] flex-shrink-0">
                <Image
                  src={item.poster || `${TMDB_IMAGE_W500}/placeholder.svg`}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="130px"
                />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

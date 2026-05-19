import Link from "next/link";
import Image from "next/image";

interface NetflixEntry {
  rank: number;
  title: string;
  poster?: string;
  slug?: string;
  type?: "movie" | "series";
}

interface NetflixTop10RowProps {
  title: string;
  items: NetflixEntry[];
  badge?: string;
  accentColor?: string;
  showRank?: boolean;
}

export default function NetflixTop10Row({ title, items, badge, accentColor = "#E50914", showRank = true }: NetflixTop10RowProps) {
  if (!items.length) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4 px-4 md:px-8">
        <div className="flex items-center gap-3">
          <h2 className="text-xl md:text-2xl font-bold text-[#F9FAFB]">{title}</h2>
          {badge && (
            <span className="text-[10px] px-2.5 py-0.5 rounded-sm font-bold tracking-wide" style={{ backgroundColor: "#E50914", color: "#fff" }}>{badge}</span>
          )}
        </div>
      </div>
      <div className="flex gap-2 md:gap-4 overflow-x-auto px-4 md:px-8 pb-2" style={{ scrollbarWidth: "none" }}>
        {items.map((entry) => {
          const card = (
            <div className={showRank ? "relative pl-8 md:pl-12" : "relative"}>
              {showRank && (
                <span className="text-8xl md:text-9xl font-extrabold text-[#1F232D] leading-none absolute left-0 top-1/2 -translate-y-1/2 select-none z-0" style={{ WebkitTextStroke: `2px ${accentColor}` }}>
                  {entry.rank}
                </span>
              )}
              <div className="relative w-[90px] sm:w-[110px] md:w-[130px] aspect-[2/3] rounded-none overflow-hidden bg-[#0E1015] border border-[#1F232D]">
                {entry.poster ? (
                  <Image
                    src={entry.poster}
                    alt={entry.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="130px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <p className="text-[10px] text-[#9CA3AF] text-center leading-tight">{entry.title}</p>
                  </div>
                )}
                {entry.poster && (
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            </div>
          );

          if (entry.slug) {
            return (
              <Link
                key={entry.rank}
                href={entry.type === "movie" ? `/movie/${entry.slug}` : `/series/${entry.slug}`}
                className="flex-shrink-0 group relative"
              >
                {card}
              </Link>
            );
          }
          return (
            <div key={entry.rank} className="flex-shrink-0">
              {card}
            </div>
          );
        })}
      </div>
    </section>
  );
}

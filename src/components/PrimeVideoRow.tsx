import Link from "next/link";
import Image from "next/image";

interface PrimeEntry {
  title: string;
  poster?: string;
  banner?: string;
  slug?: string;
  type?: "movie" | "series";
}

interface PrimeVideoRowProps {
  title: string;
  items: PrimeEntry[];
}

export default function PrimeVideoRow({ title, items }: PrimeVideoRowProps) {
  if (!items.length) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4 px-4 md:px-8">
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 48 48" className="w-7 h-7 md:w-8 md:h-8 flex-shrink-0">
            <rect width="48" height="48" rx="4" fill="#00A8E1" />
            <text x="24" y="33" fontFamily="Arial,Helvetica,sans-serif" fontSize="20" fontWeight="900" fill="white" textAnchor="middle">P</text>
          </svg>
          <h2 className="text-xl md:text-2xl font-bold text-[#F9FAFB]">{title}</h2>
          <span className="text-[10px] px-2.5 py-0.5 font-bold tracking-wide rounded-sm" style={{ backgroundColor: "#00A8E1", color: "#fff" }}>PRIME</span>
        </div>
      </div>
      <div className="flex gap-2 md:gap-4 overflow-x-auto px-4 md:px-8 pb-2" style={{ scrollbarWidth: "none" }}>
        {items.map((entry, i) => {
          const imageSrc = entry.banner || entry.poster;
          return entry.slug ? (
            <Link
              key={entry.slug || i}
              href={entry.type === "movie" ? `/prime-video/movie/${entry.slug}` : `/prime-video/series/${entry.slug}`}
              className="flex-shrink-0 group relative w-[220px] sm:w-[260px] md:w-[320px]"
            >
              <div className="relative aspect-video rounded-none overflow-hidden bg-[#0E1015] border border-[#1F232D] group-hover:border-[#00A8E1]/50 transition-all">
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={entry.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 220px, (max-width: 768px) 260px, 320px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <p className="text-[10px] text-[#9CA3AF] text-center">{entry.title}</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute left-2 top-2 px-2 py-0.5 text-[9px] font-bold tracking-wide bg-[#00A8E1] text-white">PRIME</div>
              </div>
              <p className="text-sm text-[#F9FAFB] mt-2 truncate font-medium">{entry.title}</p>
            </Link>
          ) : null;
        })}
      </div>
    </section>
  );
}

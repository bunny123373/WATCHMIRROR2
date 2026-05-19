import Link from "next/link";
import Image from "next/image";

interface PrimeEntry {
  title: string;
  poster?: string;
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
        {items.map((entry, i) => (
          entry.slug ? (
            <Link
              key={entry.slug || i}
              href={entry.type === "movie" ? `/movie/${entry.slug}` : `/series/${entry.slug}`}
              className="flex-shrink-0 group relative w-[90px] sm:w-[110px] md:w-[130px]"
            >
              <div className="relative aspect-[2/3] rounded-none overflow-hidden bg-[#0E1015] border border-[#1F232D] group-hover:border-[#00A8E1]/50 transition-all">
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
                    <p className="text-[10px] text-[#9CA3AF] text-center">{entry.title}</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[11px] text-[#F9FAFB] mt-1.5 truncate font-medium">{entry.title}</p>
            </Link>
          ) : null
        ))}
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { IContent } from "@/types";

interface PrimeVideoPageProps {
  data: {
    primeMovies: IContent[];
    primeSeries: IContent[];
    trending: IContent[];
  } | null;
}

export default function PrimeVideoPageClient({ data }: PrimeVideoPageProps) {
  if (!data || (!data.primeMovies.length && !data.primeSeries.length)) {
    return (
      <main className="min-h-screen bg-[#0F171E] pt-20 pb-20">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Image src="/primevideo.svg" alt="Prime Video" width={120} height={30} className="w-32 mx-auto mb-6" />
            <p className="text-[#8197A4]">No Prime Video content available yet.</p>
            <p className="text-[#8197A4] text-sm mt-2">Admin can mark content as Prime Video during import.</p>
          </div>
        </div>
      </main>
    );
  }

  const sections: { title: string; items: IContent[] }[] = [];
  if (data.trending.length > 0) sections.push({ title: "Trending on Prime Video", items: data.trending });
  if (data.primeMovies.length > 0) sections.push({ title: "Prime Movies", items: data.primeMovies });
  if (data.primeSeries.length > 0) sections.push({ title: "Prime Series", items: data.primeSeries });

  const hero = data.trending[0] || data.primeMovies[0] || data.primeSeries[0];
  const getPrimeHref = (item: IContent) =>
    item.type === "movie" ? `/prime-video/movie/${item.slug}` : `/prime-video/series/${item.slug}`;

  return (
    <main className="min-h-screen bg-[#0F171E] pt-14 md:pt-20 pb-20 md:pb-0">
      {/* Hero */}
      <div className="relative w-full h-[50vh] md:h-[75vh] bg-[#0F171E]">
        {hero.banner && (
          <Image src={hero.banner} alt={hero.title} fill className="object-cover opacity-70" priority sizes="100vw" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F171E] via-[#0F171E]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F171E]/80 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <Image src="/primevideo.svg" alt="Prime Video" width={120} height={30} className="w-24 md:w-32 mb-4" />
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{hero.title}</h1>
          <p className="text-sm md:text-base text-[#8197A4] max-w-xl line-clamp-2">{hero.description}</p>
          <div className="flex gap-3 mt-4">
            <Link href={getPrimeHref(hero)}
              className="px-6 py-2.5 rounded-none bg-[#00A8E1] text-white font-semibold hover:bg-[#00A8E1]/80 transition text-sm"
            >
              Watch Now
            </Link>
          </div>
        </div>
      </div>

      {/* Content Rows */}
      <div className="mt-6 md:mt-8 space-y-8 md:space-y-12">
        {sections.map((section) => (
          <section key={section.title}>
            <div className="flex items-center justify-between mb-4 px-4 md:px-8">
              <h2 className="text-xl md:text-2xl font-bold text-white">{section.title}</h2>
            </div>
            <div className="flex gap-2 md:gap-4 overflow-x-auto px-4 md:px-8 pb-2" style={{ scrollbarWidth: "none" }}>
              {section.items.map((item) => (
                <Link
                  key={item._id || item.slug}
                  href={getPrimeHref(item)}
                  className="flex-shrink-0 group relative w-[130px] sm:w-[140px] md:w-[160px]"
                >
                  <div className="relative aspect-[2/3] rounded-none overflow-hidden bg-[#1A242D] border border-[#2D3A45] group-hover:border-[#00A8E1]/50 transition-all">
                    {item.poster ? (
                      <Image
                        src={item.poster}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="160px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-2">
                        <p className="text-[10px] text-[#8197A4] text-center">{item.title}</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F171E]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-[#F9FAFB] mt-1.5 truncate font-medium">{item.title}</p>
                  <p className="text-[10px] text-[#8197A4]">{item.year} · {item.language}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

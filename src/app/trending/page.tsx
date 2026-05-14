import { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Content } from "@/lib/models/Content";
import TrendingRow from "@/components/TrendingRow";
import ContentCard from "@/components/ContentCard";
import { IContent } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trending",
  description: "Trending movies and web series. Stream what's popular on WATCHMIRROR.",
  openGraph: {
    title: "Trending | WATCHMIRROR",
    description: "Trending movies and web series.",
  },
};

async function getTrending() {
  try {
    const db = await connectDB();
    if (!db) return [];
    const items = await Content.find({
      $or: [{ popularity: { $gt: 100 } }, { rating: { $gt: 7.5 } }],
    })
      .sort({ popularity: -1 })
      .limit(50)
      .lean();
    return JSON.parse(JSON.stringify(items));
  } catch {
    return [];
  }
}

export default async function TrendingPage() {
  const items = await getTrending();

  return (
    <main className="min-h-screen pt-16 pb-20 md:pb-0">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#F9FAFB] mb-8">Trending</h1>
        <TrendingRow title="" items={items} />
        {items.length > 10 && (
          <div className="mt-12">
            <h2 className="text-xl md:text-2xl font-bold text-[#F9FAFB] mb-4 px-4 md:px-0">More Trending</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {items.slice(10).map((item: IContent) => (
                <div key={item.slug} className="w-full">
                  <ContentCard item={item} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

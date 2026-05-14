import { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Content } from "@/lib/models/Content";
import ContentGrid from "@/components/ContentGrid";

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
        <ContentGrid items={items} />
      </div>
    </main>
  );
}

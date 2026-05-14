import { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Content } from "@/lib/models/Content";
import ContentGrid from "@/components/ContentGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Series",
  description: "Browse our collection of premium web series. Stream without limits on WATCHMIRROR.",
  openGraph: {
    title: "Series | WATCHMIRROR",
    description: "Browse our collection of premium web series.",
  },
};

async function getSeries() {
  try {
    const db = await connectDB();
    if (!db) return [];
    const items = await Content.find({ type: "series" })
      .sort({ popularity: -1 })
      .limit(50)
      .lean();
    return JSON.parse(JSON.stringify(items));
  } catch {
    return [];
  }
}

export default async function SeriesPage() {
  const series = await getSeries();

  return (
    <main className="min-h-screen pt-16 pb-20 md:pb-0">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#F9FAFB] mb-8">Series</h1>
        <ContentGrid items={series} />
      </div>
    </main>
  );
}

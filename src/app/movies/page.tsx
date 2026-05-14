import { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Content } from "@/lib/models/Content";
import ContentGrid from "@/components/ContentGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Movies",
  description: "Browse our collection of premium movies. Stream without limits on WATCHMIRROR.",
  openGraph: {
    title: "Movies | WATCHMIRROR",
    description: "Browse our collection of premium movies.",
  },
};

async function getMovies() {
  try {
    const db = await connectDB();
    if (!db) return [];
    const items = await Content.find({ type: "movie" })
      .sort({ popularity: -1 })
      .limit(50)
      .lean();
    return JSON.parse(JSON.stringify(items));
  } catch {
    return [];
  }
}

export default async function MoviesPage() {
  const movies = await getMovies();

  return (
    <main className="min-h-screen pt-14 md:pt-16 pb-20 md:pb-0">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#F9FAFB] mb-8">Movies</h1>
        <ContentGrid items={movies} />
      </div>
    </main>
  );
}

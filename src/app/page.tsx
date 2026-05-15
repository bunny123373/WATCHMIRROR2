import { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Content } from "@/lib/models/Content";
import { IContent } from "@/types";
import HeroBanner from "@/components/HeroBanner";
import ContinueWatchingRow from "@/components/ContinueWatchingRow";
import ContentRow from "@/components/ContentRow";
import TrendingRow from "@/components/TrendingRow";
import MyListRow from "@/components/MyListRow";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "WATCHMIRROR - Stream Without Limits",
  description:
    "Watch premium movies and web series online in HD. Stream without limits on WATCHMIRROR - your ultimate OTT streaming platform.",
  openGraph: {
    title: "WATCHMIRROR - Stream Without Limits",
    description:
      "Watch premium movies and web series online in HD. Stream without limits.",
    siteName: "WATCHMIRROR",
  },
  twitter: {
    title: "WATCHMIRROR - Stream Without Limits",
    description:
      "Watch premium movies and web series online in HD. Stream without limits.",
    site: "WATCHMIRROR",
  },
};

async function getHomeData() {
  try {
    const db = await connectDB();
    if (!db) return null;

    const [trending, latest, movies, series, action, drama, comedy, horror, english, hindi, korean] =
      await Promise.all([
        Content.find({
          $or: [{ popularity: { $gt: 100 } }, { rating: { $gt: 7.5 } }],
        })
          .sort({ popularity: -1 })
          .limit(20)
          .lean(),
        Content.find().sort({ createdAt: -1 }).limit(20).lean(),
        Content.find({ type: "movie" }).sort({ popularity: -1 }).limit(20).lean(),
        Content.find({ type: "series" }).sort({ popularity: -1 }).limit(20).lean(),
        Content.find({ tags: "Action" }).sort({ popularity: -1 }).limit(20).lean(),
        Content.find({ tags: "Drama" }).sort({ popularity: -1 }).limit(20).lean(),
        Content.find({ tags: "Comedy" }).sort({ popularity: -1 }).limit(20).lean(),
        Content.find({ tags: "Horror" }).sort({ popularity: -1 }).limit(20).lean(),
        Content.find({ language: "English" }).sort({ popularity: -1 }).limit(20).lean(),
        Content.find({ language: "Hindi" }).sort({ popularity: -1 }).limit(20).lean(),
        Content.find({ language: "Korean" }).sort({ popularity: -1 }).limit(20).lean(),
        Content.find({ language: "Hindi" }).sort({ popularity: -1 }).limit(10).lean(),
      ]);

    return {
      trending: JSON.parse(JSON.stringify(trending)),
      latest: JSON.parse(JSON.stringify(latest)),
      movies: JSON.parse(JSON.stringify(movies)),
      series: JSON.parse(JSON.stringify(series)),
      action: JSON.parse(JSON.stringify(action)),
      drama: JSON.parse(JSON.stringify(drama)),
      comedy: JSON.parse(JSON.stringify(comedy)),
      horror: JSON.parse(JSON.stringify(horror)),
      english: JSON.parse(JSON.stringify(english)),
      hindi: JSON.parse(JSON.stringify(hindi)),
      korean: JSON.parse(JSON.stringify(korean)),
    };
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const data = await getHomeData();

  if (!data) {
    return (
<main className="min-h-screen pt-14 md:pt-28 pb-20 md:pb-0">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#F9FAFB] mb-4">WATCHMIRROR</h1>
            <p className="text-[#9CA3AF]">Stream Without Limits.</p>
            <p className="text-[#9CA3AF] text-sm mt-4">
              Connect to MongoDB and add content to get started.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const sections: { title: string; items: IContent[]; href?: string; trending?: boolean }[] = [];

  if (data.trending.length > 0)
    sections.push({ title: "Trending Now", items: data.trending, href: "/trending", trending: true });
  if (data.latest.length > 0)
    sections.push({ title: "Latest Added", items: data.latest });
  if (data.movies.length > 0)
    sections.push({ title: "Movies", items: data.movies, href: "/movies" });
  if (data.series.length > 0)
    sections.push({ title: "Series", items: data.series, href: "/series" });
  if (data.action.length > 0)
    sections.push({ title: "Action", items: data.action, href: "/category/action" });
  if (data.drama.length > 0)
    sections.push({ title: "Drama", items: data.drama, href: "/category/drama" });
  if (data.comedy.length > 0)
    sections.push({ title: "Comedy", items: data.comedy, href: "/category/comedy" });
  if (data.horror.length > 0)
    sections.push({ title: "Horror", items: data.horror, href: "/category/horror" });
  if (data.english.length > 0)
    sections.push({ title: "English", items: data.english });
  if (data.hindi.length > 0)
    sections.push({ title: "Hindi", items: data.hindi });
  if (data.korean.length > 0)
    sections.push({ title: "Korean", items: data.korean });

  return (
    <main className="min-h-screen pt-14 md:pt-28 pb-20 md:pb-0">
      <HeroBanner items={data.trending} />

      <div className="mt-4 md:mt-8 space-y-8 md:space-y-12">
        <ContinueWatchingRow />
        <MyListRow />

        {sections.map((section) =>
          section.trending ? (
            <TrendingRow
              key={section.title}
              title={section.title}
              items={section.items}
              viewAllHref={section.href}
            />
          ) : (
            <ContentRow
              key={section.title}
              title={section.title}
              items={section.items}
              viewAllHref={section.href}
            />
          )
        )}
      </div>
    </main>
  );
}

import { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Content } from "@/lib/models/Content";
import PrimeVideoPageClient from "./PrimeVideoPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Prime Video | WATCHMIRROR",
  description: "Stream Prime Video movies and web series in HD on WATCHMIRROR.",
  openGraph: {
    title: "Prime Video | WATCHMIRROR",
    description: "Stream Prime Video movies and web series in HD.",
    siteName: "WATCHMIRROR",
  },
};

async function getPrimeVideoData() {
  try {
    const db = await connectDB();
    if (!db) return null;

    const [primeMovies, primeSeries, trending] = await Promise.all([
      Content.find({ type: "movie", primeVideo: true }).sort({ popularity: -1 }).limit(20).lean(),
      Content.find({ type: "series", primeVideo: true }).sort({ popularity: -1 }).limit(20).lean(),
      Content.find({ primeVideo: true, $or: [{ popularity: { $gt: 50 } }, { rating: { $gt: 7 } }] })
        .sort({ popularity: -1 })
        .limit(10)
        .lean(),
    ]);

    return {
      primeMovies: JSON.parse(JSON.stringify(primeMovies)),
      primeSeries: JSON.parse(JSON.stringify(primeSeries)),
      trending: JSON.parse(JSON.stringify(trending)),
    };
  } catch {
    return null;
  }
}

export default async function PrimeVideoPage() {
  const data = await getPrimeVideoData();

  return <PrimeVideoPageClient data={data} />;
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Content } from "@/lib/models/Content";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    const netflixOnly = { primeVideo: { $ne: true } };

    const [trending, latest, movies, series, action, drama, comedy, horror, english, hindi, korean] =
      await Promise.all([
        Content.find({ ...netflixOnly, $or: [{ popularity: { $gt: 100 } }, { rating: { $gt: 7.5 } }] })
          .sort({ popularity: -1 }).limit(20).lean(),
        Content.find(netflixOnly).sort({ createdAt: -1 }).limit(20).lean(),
        Content.find({ ...netflixOnly, type: "movie" }).sort({ popularity: -1 }).limit(20).lean(),
        Content.find({ ...netflixOnly, type: "series" }).sort({ popularity: -1 }).limit(20).lean(),
        Content.find({ ...netflixOnly, tags: "Action" }).sort({ popularity: -1 }).limit(20).lean(),
        Content.find({ ...netflixOnly, tags: "Drama" }).sort({ popularity: -1 }).limit(20).lean(),
        Content.find({ ...netflixOnly, tags: "Comedy" }).sort({ popularity: -1 }).limit(20).lean(),
        Content.find({ ...netflixOnly, tags: "Horror" }).sort({ popularity: -1 }).limit(20).lean(),
        Content.find({ ...netflixOnly, language: "English" }).sort({ popularity: -1 }).limit(20).lean(),
        Content.find({ ...netflixOnly, language: "Hindi" }).sort({ popularity: -1 }).limit(20).lean(),
        Content.find({ ...netflixOnly, language: "Korean" }).sort({ popularity: -1 }).limit(20).lean(),
      ]);

    const parse = (data: any) => JSON.parse(JSON.stringify(data));

    return NextResponse.json({
      trending: parse(trending),
      latest: parse(latest),
      movies: parse(movies),
      series: parse(series),
      action: parse(action),
      drama: parse(drama),
      comedy: parse(comedy),
      horror: parse(horror),
      english: parse(english),
      hindi: parse(hindi),
      korean: parse(korean),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch home data" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { searchMulti } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");
  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const data = await searchMulti(query);
    const filtered = data.results.filter(
      (r: any) => r.media_type === "movie" || r.media_type === "tv"
    );
    return NextResponse.json({ results: filtered }, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=3600" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to search TMDB" }, { status: 500 });
  }
}

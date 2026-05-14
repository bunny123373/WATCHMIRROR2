import { NextRequest, NextResponse } from "next/server";
import { searchMulti } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");
  const type = request.nextUrl.searchParams.get("type") || "all";
  const year = request.nextUrl.searchParams.get("year") || "";

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const data = await searchMulti(query);
    let filtered = data.results.filter(
      (r: any) => r.media_type === "movie" || r.media_type === "tv"
    );

    if (type !== "all") {
      filtered = filtered.filter((r: any) => r.media_type === type);
    }

    if (year) {
      const y = parseInt(year);
      filtered = filtered.filter((r: any) => {
        const d = r.release_date || r.first_air_date || "";
        return d.startsWith(y.toString());
      });
    }

    return NextResponse.json({ results: filtered }, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=3600" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to search TMDB" }, { status: 500 });
  }
}

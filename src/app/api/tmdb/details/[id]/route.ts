import { NextRequest, NextResponse } from "next/server";
import { getMovieDetails, getTvDetails } from "@/lib/tmdb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const type = request.nextUrl.searchParams.get("type") || "movie";

  try {
    const data = type === "movie"
      ? await getMovieDetails(Number(id))
      : await getTvDetails(Number(id));

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=3600" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch details" }, { status: 500 });
  }
}

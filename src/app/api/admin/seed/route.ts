import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Content } from "@/lib/models/Content";
import { getMovieDetails, getTvDetails } from "@/lib/tmdb";

function validateAdmin(request: NextRequest) {
  const key = request.headers.get("x-admin-key");
  return key === process.env.ADMIN_KEY;
}

export async function POST(request: NextRequest) {
  if (!validateAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    const body = await request.json();
    const { tmdbId, type, hlsLink, embedIframeLink, downloadLink, seasons, language, dubLanguages, audioAvailable, streams } = body;

    let data;
    try {
      data = type === "movie"
        ? await getMovieDetails(tmdbId)
        : await getTvDetails(tmdbId);
    } catch {
      return NextResponse.json({ error: "Failed to fetch from TMDB — check your API key and network" }, { status: 400 });
    }

    const title = data.title || data.name;
    const slug = title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").trim();
    const year = new Date(data.release_date || data.first_air_date || "").getFullYear() || new Date().getFullYear();

    const trailer = data.videos?.results?.find(
      (v: any) => v.site === "YouTube" && v.type === "Trailer"
    );

    const cast = (data.credits?.cast || []).slice(0, 8).map((c: any) => ({
      name: c.name,
      character: c.character,
      profileImage: c.profile_path
        ? `https://image.tmdb.org/t/p/w500${c.profile_path}`
        : "",
    }));

    const category = data.genres?.[0]?.name || "Action";
    const tags = data.genres?.map((g: any) => g.name) || [];

    const contentData: any = {
      type,
      title,
      slug,
      poster: data.poster_path
        ? `https://image.tmdb.org/t/p/original${data.poster_path}`
        : "",
      banner: data.backdrop_path
        ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
        : "",
      description: data.overview || "",
      year,
      language: language || "English",
      dubLanguage: dubLanguages || [],
      audioAvailable: audioAvailable || ["English"],
      category,
      quality: "1080p",
      rating: data.vote_average || 0,
      tags,
      popularity: data.popularity || 0,
      trailerEmbedUrl: trailer
        ? `https://www.youtube.com/embed/${trailer.key}`
        : "",
      cast,
      metaTitle: `Watch ${title} Online in HD | WATCHMIRROR`,
      metaDescription: data.overview
        ? data.overview.slice(0, 160)
        : `Watch ${title} online in HD quality on WATCHMIROR. Stream without limits.`,
    };

    contentData.downloadLink = downloadLink || "";
    contentData.streams = streams || [];

    if (type === "movie") {
      contentData.hlsLink = hlsLink || "";
      contentData.embedIframeLink = embedIframeLink || "";
    } else {
      contentData.seasons = seasons || [];
    }

    const existing = await Content.findOne({ slug });
    if (existing) {
      return NextResponse.json({ message: "Content already exists", content: existing });
    }

    const content = await Content.create(contentData);
    return NextResponse.json(content, { status: 201 });
  } catch (error: any) {
    const msg = error?.message || "Failed to seed content";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

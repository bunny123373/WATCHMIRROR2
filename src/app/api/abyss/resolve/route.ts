import { NextRequest, NextResponse } from "next/server";

const ABYSS_API = "https://api.abyss.to";
const ABYSS_KEY = process.env.ABYSS_KEY || "";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
  }

  const embedUrl = `https://abyssplayer.com/${id}`;

  try {
    const res = await fetch(`${ABYSS_API}/v1/files/${id}?key=${ABYSS_KEY}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        id,
        name: data.name,
        size: data.size,
        status: data.status,
        embedUrl,
        playerUrl: embedUrl,
      });
    }
  } catch {}

  return NextResponse.json({ id, embedUrl, playerUrl: embedUrl });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const embedUrl = `https://abyssplayer.com/${id}`;

    try {
      const res = await fetch(`${ABYSS_API}/v1/files/${id}?key=${ABYSS_KEY}`, {
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({
          id,
          name: data.name,
          size: data.size,
          status: data.status,
          embedUrl,
          playerUrl: embedUrl,
        });
      }
    } catch {}

    return NextResponse.json({ id, embedUrl, playerUrl: embedUrl });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

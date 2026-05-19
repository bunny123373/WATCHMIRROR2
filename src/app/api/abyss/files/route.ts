import { NextRequest, NextResponse } from "next/server";

const ABYSS_API = "https://api.abyss.to";
const ABYSS_KEY = process.env.ABYSS_KEY || "";

export async function GET() {
  try {
    const res = await fetch(`${ABYSS_API}/v1/resources?key=${ABYSS_KEY}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch Abyss files" }, { status: 502 });
    }
    const data = await res.json();
    const files = (data.items || [])
      .filter((item: any) => !item.isDir && item.status === "ready")
      .map((item: any) => ({
        id: item.id,
        name: item.name,
        size: item.size,
        resolutions: item.resolutions || [],
        createdAt: item.createdAt,
      }));
    return NextResponse.json({ files });
  } catch {
    return NextResponse.json({ error: "Abyss API unreachable" }, { status: 502 });
  }
}

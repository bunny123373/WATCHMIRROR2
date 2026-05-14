import { NextRequest, NextResponse } from "next/server";
import { addAudioTrack, addTextTrack } from "@/lib/mux";

export async function POST(req: NextRequest) {
  try {
    const { assetId, url, languageCode, name, type } = await req.json();
    const tokenId = req.headers.get("x-mux-token-id") || undefined;
    const tokenSecret = req.headers.get("x-mux-token-secret") || undefined;
    if (!assetId || !url || !languageCode) {
      return NextResponse.json({ error: "assetId, url, and languageCode required" }, { status: 400 });
    }
    if (type === "text") {
      await addTextTrack(assetId, url, languageCode, name || languageCode, tokenId, tokenSecret);
    } else {
      await addAudioTrack(assetId, url, languageCode, name || languageCode, tokenId, tokenSecret);
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createDirectUpload } from "@/lib/mux";

export async function POST(req: NextRequest) {
  try {
    const tokenId = req.headers.get("x-mux-token-id") || undefined;
    const tokenSecret = req.headers.get("x-mux-token-secret") || undefined;
    const upload = await createDirectUpload(tokenId, tokenSecret);
    return NextResponse.json(upload);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getUploadStatus, getAssetStatus } from "@/lib/mux";

export async function GET(req: NextRequest) {
  const uploadId = req.nextUrl.searchParams.get("uploadId");
  const assetId = req.nextUrl.searchParams.get("assetId");
  const tokenId = req.headers.get("x-mux-token-id") || undefined;
  const tokenSecret = req.headers.get("x-mux-token-secret") || undefined;
  try {
    if (assetId) {
      const asset = await getAssetStatus(assetId, tokenId, tokenSecret);
      return NextResponse.json(asset);
    }
    if (uploadId) {
      const status = await getUploadStatus(uploadId, tokenId, tokenSecret);
      return NextResponse.json(status);
    }
    return NextResponse.json({ error: "Provide uploadId or assetId" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

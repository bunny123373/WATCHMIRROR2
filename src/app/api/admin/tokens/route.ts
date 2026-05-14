import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { MuxToken } from "@/lib/models/MuxToken";

const ADMIN_KEY = "WATCHMIRROR123";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(req: NextRequest) {
  if (req.headers.get("x-admin-key") !== ADMIN_KEY) return unauthorized();
  await connectDB();
  const tokens = await MuxToken.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(tokens);
}

export async function POST(req: NextRequest) {
  if (req.headers.get("x-admin-key") !== ADMIN_KEY) return unauthorized();
  try {
    const { label, tokenId, tokenSecret } = await req.json();
    if (!label || !tokenId || !tokenSecret) {
      return NextResponse.json({ error: "label, tokenId, and tokenSecret required" }, { status: 400 });
    }
    await connectDB();
    const doc = await MuxToken.create({ label, tokenId, tokenSecret });
    return NextResponse.json(doc, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (req.headers.get("x-admin-key") !== ADMIN_KEY) return unauthorized();
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await connectDB();
  await MuxToken.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

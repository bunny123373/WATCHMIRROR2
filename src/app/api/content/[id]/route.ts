import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Content } from "@/lib/models/Content";

function validateAdmin(request: NextRequest) {
  const key = request.headers.get("x-admin-key");
  return key === process.env.ADMIN_KEY;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const content = await Content.findOne({ slug: id }).lean();
    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const content = await Content.findByIdAndUpdate(id, body, { new: true });
    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    await Content.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete content" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Content } from "@/lib/models/Content";

function validateAdmin(request: NextRequest) {
  const key = request.headers.get("x-admin-key");
  return key === process.env.ADMIN_KEY;
}

export async function GET(request: NextRequest) {
  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    const { searchParams } = request.nextUrl;
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const language = searchParams.get("language");
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 50);
    const page = Number(searchParams.get("page")) || 1;
    const sort = searchParams.get("sort") || "-popularity";
    const search = searchParams.get("search");
    const primeVideo = searchParams.get("primeVideo");

    const filter: Record<string, any> = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (language) filter.language = language;
    if (search) filter.title = { $regex: search, $options: "i" };
    if (primeVideo === "true") filter.primeVideo = true;

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Content.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Content.countDocuments(filter),
    ]);

    return NextResponse.json({ items, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!validateAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    const body = await request.json();
    const content = await Content.create(body);
    return NextResponse.json(content, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "Content with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create content" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!validateAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    const body = await request.json();
    const { _id, ...updateData } = body;
    const content = await Content.findByIdAndUpdate(_id, updateData, { new: true });
    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!validateAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await connectDB();
    if (!db) return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    await Content.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete content" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { createDirectUpload } from "@/lib/mux";

export async function POST() {
  try {
    const upload = await createDirectUpload();
    return NextResponse.json(upload);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

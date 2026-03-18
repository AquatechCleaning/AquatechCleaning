import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { MediaItem } from "@/lib/models/MediaItem";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");
  await dbConnect();
  const filter = featured ? { featured: featured === "true" } : {};
  const items = await MediaItem.find(filter).sort({ createdAt: -1 }).limit(12);
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const item = await MediaItem.create(body);
    return NextResponse.json(item);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to save media item" }, { status: 500 });
  }
}

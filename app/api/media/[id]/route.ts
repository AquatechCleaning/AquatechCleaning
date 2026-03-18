import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { MediaItem } from "@/lib/models/MediaItem";

type Params = { params: { id: string } };

export async function PUT(request: Request, { params }: Params) {
  try {
    await dbConnect();
    const data = await request.json();
    const updated = await MediaItem.findByIdAndUpdate(params.id, data, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to update media item" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await dbConnect();
    await MediaItem.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to delete media item" }, { status: 500 });
  }
}

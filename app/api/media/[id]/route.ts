import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { MediaItem } from "@/lib/models/MediaItem";
import { requireAdminApi } from "@/lib/adminAuth";
import { extractDriveFileId, normalizeImageUrl } from "@/lib/mediaUrls";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteContext) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    await dbConnect();
    const data = await request.json();
    const payload = {
      ...data,
      beforeDriveFileId: data.beforeDriveFileId || extractDriveFileId(data.imageBeforeUrl),
      afterDriveFileId: data.afterDriveFileId || extractDriveFileId(data.imageAfterUrl),
      imageBeforeUrl: normalizeImageUrl(data.imageBeforeUrl, data.beforeDriveFileId),
      imageAfterUrl: normalizeImageUrl(data.imageAfterUrl, data.afterDriveFileId),
    };
    const { id } = await params;
    const updated = await MediaItem.findByIdAndUpdate(id, payload, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to update media item" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    await dbConnect();
    const { id } = await params;
    await MediaItem.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to delete media item" }, { status: 500 });
  }
}

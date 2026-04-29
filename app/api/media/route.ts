import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { MediaItem } from "@/lib/models/MediaItem";
import { requireAdminApi } from "@/lib/adminAuth";
import { extractDriveFileId, normalizeImageUrl } from "@/lib/mediaUrls";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");
  await dbConnect();
  const filter = featured ? { featured: featured === "true" } : {};
  const items = await MediaItem.find(filter).sort({ createdAt: -1 }).limit(12).lean();
  return NextResponse.json(
    items.map((item) => ({
      ...item,
      beforeDriveFileId: item.beforeDriveFileId || extractDriveFileId(item.imageBeforeUrl),
      afterDriveFileId: item.afterDriveFileId || extractDriveFileId(item.imageAfterUrl),
      imageBeforeUrl: normalizeImageUrl(item.imageBeforeUrl, item.beforeDriveFileId),
      imageAfterUrl: normalizeImageUrl(item.imageAfterUrl, item.afterDriveFileId),
    }))
  );
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    await dbConnect();
    const body = await request.json();
    const payload = {
      ...body,
      beforeDriveFileId: body.beforeDriveFileId || extractDriveFileId(body.imageBeforeUrl),
      afterDriveFileId: body.afterDriveFileId || extractDriveFileId(body.imageAfterUrl),
      imageBeforeUrl: normalizeImageUrl(body.imageBeforeUrl, body.beforeDriveFileId),
      imageAfterUrl: normalizeImageUrl(body.imageAfterUrl, body.afterDriveFileId),
    };
    const item = await MediaItem.create(payload);
    return NextResponse.json(item);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to save media item" }, { status: 500 });
  }
}

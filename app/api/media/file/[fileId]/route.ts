import { NextResponse } from "next/server";
import { fetchDriveFile } from "@/lib/googleDrive";

type RouteContext = { params: Promise<{ fileId: string }> };

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { fileId } = await params;
    if (!fileId) {
      return NextResponse.json({ error: "fileId required" }, { status: 400 });
    }

    const response = await fetchDriveFile(fileId);
    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Unable to load media file", details: message }, { status: 500 });
  }
}

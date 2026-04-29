import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminAuth";
import { uploadFileToDrive } from "@/lib/googleDrive";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folderName = formData.get("folderName");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const uploaded = await uploadFileToDrive(file, {
      folderName: typeof folderName === "string" ? folderName : undefined,
    });

    return NextResponse.json(uploaded);
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Unable to upload media", details: message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { SiteSettings } from "@/lib/models/SiteSettings";
import { requireAdminApi } from "@/lib/adminAuth";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  await dbConnect();
  const settings = await SiteSettings.findOne();
  return NextResponse.json(settings || {});
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    await dbConnect();
    const body = await request.json();
    const { _id, __v, createdAt, updatedAt, ...safeBody } = body ?? {};
    const settings = await SiteSettings.findOneAndUpdate({}, safeBody, {
      upsert: true,
      new: true,
    });
    return NextResponse.json(settings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to save settings" }, { status: 500 });
  }
}

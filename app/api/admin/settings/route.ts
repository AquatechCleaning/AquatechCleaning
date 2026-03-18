import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { SiteSettings } from "@/lib/models/SiteSettings";

export async function GET() {
  await dbConnect();
  const settings = await SiteSettings.findOne();
  return NextResponse.json(settings || {});
}

export async function POST(request: Request) {
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

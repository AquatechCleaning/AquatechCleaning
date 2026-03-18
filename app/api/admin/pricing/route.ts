import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { PricingSettings } from "@/lib/models/PricingSettings";

export async function GET() {
  await dbConnect();
  const settings = await PricingSettings.findOne();
  return NextResponse.json(settings || {});
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { _id, __v, createdAt, updatedAt, ...safeBody } = body ?? {};
    const settings = await PricingSettings.findOneAndUpdate({}, safeBody, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
    return NextResponse.json(settings);
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Unable to save pricing", details: message }, { status: 500 });
  }
}

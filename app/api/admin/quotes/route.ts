import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Quote } from "@/lib/models/Quote";

export async function GET() {
  try {
    await dbConnect();
    const quotes = await Quote.find().sort({ createdAt: -1 }).limit(100);
    return NextResponse.json(quotes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to fetch quotes" }, { status: 500 });
  }
}

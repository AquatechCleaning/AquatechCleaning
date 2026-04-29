import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Quote } from "@/lib/models/Quote";
import { requireAdminApi } from "@/lib/adminAuth";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    await dbConnect();
    const quotes = await Quote.find().sort({ createdAt: -1 }).limit(100);
    return NextResponse.json(quotes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to fetch quotes" }, { status: 500 });
  }
}

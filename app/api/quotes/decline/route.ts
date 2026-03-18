import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Quote } from "@/lib/models/Quote";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { quoteId, reason } = body as { quoteId: string; reason?: string };

    if (!quoteId) {
      return NextResponse.json({ error: "quoteId required" }, { status: 400 });
    }

    await dbConnect();
    const quote = await Quote.findById(quoteId);
    if (!quote) return NextResponse.json({ error: "Quote not found" }, { status: 404 });

    quote.status = "Declined";
    quote.declineReason = reason;
    await quote.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to decline quote" }, { status: 500 });
  }
}

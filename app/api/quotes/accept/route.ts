import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Quote } from "@/lib/models/Quote";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { quoteId } = body as { quoteId: string };

    if (!quoteId) {
      return NextResponse.json({ error: "quoteId required" }, { status: 400 });
    }

    await dbConnect();
    const quote = await Quote.findById(quoteId);
    if (!quote) return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    if (quote.status === "Accepted") {
      return NextResponse.json({ success: true });
    }

    quote.status = "Accepted";
    await quote.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to accept quote" }, { status: 500 });
  }
}

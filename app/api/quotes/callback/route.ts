import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Customer } from "@/lib/models/Customer";
import { Lead } from "@/lib/models/Lead";
import { Quote } from "@/lib/models/Quote";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { quoteId } = body as { quoteId?: string };

    if (!quoteId) {
      return NextResponse.json({ error: "quoteId required" }, { status: 400 });
    }

    await dbConnect();
    const quote = await Quote.findById(quoteId);
    if (!quote) return NextResponse.json({ error: "Quote not found" }, { status: 404 });

    quote.status = "Callback Requested";
    await quote.save();

    const customer = await Customer.findById(quote.customerId);
    if (customer) {
      await Lead.create({
        name: `${customer.name} ${customer.surname ?? ""}`.trim(),
        email: customer.email,
        phone: customer.phone,
        message: `Callback requested for quote ${quote.quoteNumber ?? quote._id.toString()}.`,
        source: "Quote Callback Request",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to request callback" }, { status: 500 });
  }
}

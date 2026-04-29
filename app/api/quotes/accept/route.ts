import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Quote } from "@/lib/models/Quote";
import { Customer } from "@/lib/models/Customer";
import { Property } from "@/lib/models/Property";
import { sendMetaServerEvent } from "@/lib/metaCapi";
import { notifyQuoteByGoogleMail } from "@/lib/googleQuoteNotifications";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { quoteId, meta } = body as {
      quoteId: string;
      meta?: { eventId?: string; fbp?: string; fbc?: string; sourceUrl?: string; consent?: boolean };
    };

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

    const customer = await Customer.findById(quote.customerId);
    const property = await Property.findById(quote.propertyId);

    if (meta?.consent) {
      await sendMetaServerEvent({
        eventName: "QuoteAccepted",
        eventId: meta?.eventId,
        request,
        sourceUrl: meta?.sourceUrl,
        fbp: meta?.fbp,
        fbc: meta?.fbc,
        email: customer?.email,
        phone: customer?.phone,
        value: quote.totalAmount,
        currency: quote.currency,
        quoteId: quote._id.toString(),
        quoteNumber: quote.quoteNumber,
      });
    }

    if (customer) {
      await notifyQuoteByGoogleMail({
        event: "accepted",
        quote,
        customer,
        property,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to accept quote" }, { status: 500 });
  }
}

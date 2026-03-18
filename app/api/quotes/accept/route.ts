import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Quote } from "@/lib/models/Quote";
import { Job } from "@/lib/models/Job";
import { Reminder } from "@/lib/models/Reminder";
import { Invoice } from "@/lib/models/Invoice";

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

    quote.status = "Accepted";
    await quote.save();

    const job = await Job.create({
      quoteId: quote._id,
      customerId: quote.customerId,
      propertyId: quote.propertyId,
      servicesPerformed: quote.areas,
      totalAreaSqm: quote.areas.reduce((sum, area) => sum + (area.sqm || 0), 0),
      status: "Scheduled",
    });

    // stub invoice creation to trigger reminders
    const invoice = await Invoice.create({
      jobId: job._id,
      invoiceNumber: `AQ-${Date.now()}`,
      invoiceDate: new Date(),
      totalAmount: quote.totalAmount,
      paid: false,
    });

    await Reminder.create({
      customerId: quote.customerId,
      jobId: job._id,
      dueDate: new Date(new Date(invoice.invoiceDate).setMonth(new Date().getMonth() + 6)),
      status: "Pending",
      channel: "email",
    });

    return NextResponse.json({ success: true, jobId: job._id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to accept quote" }, { status: 500 });
  }
}

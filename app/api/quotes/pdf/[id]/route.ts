import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Quote } from "@/lib/models/Quote";
import { Customer } from "@/lib/models/Customer";
import { Property } from "@/lib/models/Property";
import { calculateQuote } from "@/lib/pricing";
import { generateQuotePdf } from "../../../../../lib/pdf";
import { SiteSettings } from "@/lib/models/SiteSettings";

export const runtime = "nodejs";

type Params = {
  params: { id: string };
};

export async function GET(req: Request, { params }: Params) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const debug = searchParams.get("debug") === "1";
    const pathname = new URL(req.url).pathname;
    const pathSegments = pathname.split("/").filter(Boolean);
    const pdfIndex = pathSegments.indexOf("pdf");
    const pathId =
      pdfIndex >= 0 && pathSegments[pdfIndex + 1] ? pathSegments[pdfIndex + 1] : pathSegments[pathSegments.length - 1];
    const rawId = params?.id ?? pathId;
    const id = typeof rawId === "string" ? decodeURIComponent(rawId).trim() : "";
    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Quote ID is required" }, { status: 400 });
    }
    if (debug) {
      const connection = mongoose.connection;
      const dbName = connection.db?.databaseName ?? connection.name;
      const host = connection.host ? `${connection.host}${connection.port ? `:${connection.port}` : ""}` : "unknown";
      const exists = await Quote.exists({ _id: id });
      const recent = await Quote.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select({ _id: 1, createdAt: 1, totalAmount: 1 });
      return NextResponse.json({
        id,
        rawId,
        idLength: id.length,
        dbName,
        host,
        exists: Boolean(exists),
        recent,
      });
    }
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    let quote = isValidObjectId ? await Quote.findById(id) : null;
    if (!quote) {
      const objectId = isValidObjectId ? new mongoose.Types.ObjectId(id) : null;
      const rawQuote = await Quote.collection.findOne(
        objectId ? { $or: [{ _id: objectId }, { _id: id }] } : { _id: id }
      );
      if (!rawQuote) {
        return NextResponse.json({ error: "Quote not found", details: id }, { status: 404 });
      }
      quote = rawQuote as any;
    }

    const customer = await Customer.findById(quote.customerId);
    const property = await Property.findById(quote.propertyId);
    const settings = await SiteSettings.findOne();

    const pricing = await calculateQuote(quote.areas);
    const isCommercial = property?.propertyType === "commercial";
    const customerName = customer
      ? isCommercial && customer.companyName
        ? customer.companyName
        : `${customer.name} ${customer.surname ?? ""}`.trim()
      : "Customer";
    const companyName = settings?.companyName || "AQUATECH CLEANING (PTY) LTD";
    const quoteNumber = quote.quoteNumber || `QU-${quote._id.toString().slice(-6).toUpperCase()}`;
    const dueDate = quote.dueDate ? new Date(quote.dueDate) : new Date(quote.createdAt.getTime() + 3 * 86400000);

    const pdfBuffer = await generateQuotePdf({
      quote,
      lineItems: pricing.items,
      vatIncluded: pricing.vatIncluded,
      vatAmount: pricing.vatAmount,
      vatRate: pricing.vatRate,
      from: {
        name: companyName,
        vatNumber: settings?.companyVatNumber,
        regNumber: settings?.companyRegNumber,
        postalAddress: settings?.companyPostalAddress,
        physicalAddress: settings?.companyPhysicalAddress,
      },
      to: {
        name: customerName,
        vatNumber: customer?.vatNumber,
        regNumber: customer?.companyRegNumber,
        postalAddress: property?.address || "",
        physicalAddress: property?.address || "",
      },
      meta: {
        quoteNumber,
        reference: quote.reference || quoteNumber,
        date: quote.createdAt,
        dueDate,
        salesRep: settings?.companySalesRep,
        discountPercent: 0,
      },
    });

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=quote-${quote._id}.pdf`,
      },
    });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Unable to generate PDF", details: message }, { status: 500 });
  }
}

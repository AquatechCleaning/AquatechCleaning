import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { quoteSchema } from "@/lib/validators";
import { calculateQuote } from "@/lib/pricing";
import { Customer } from "@/lib/models/Customer";
import { Property } from "@/lib/models/Property";
import { Quote } from "@/lib/models/Quote";
import { SiteSettings } from "@/lib/models/SiteSettings";
import { QuoteSequence } from "@/lib/models/QuoteSequence";
import { rateLimit, getIP } from "@/lib/rateLimit";

const formatMapPath = (path?: Array<{ lat: number; lng: number }>, shape?: "polygon" | "polyline" | "manual") => {
  if (!path || path.length < 2 || shape === "manual") return undefined;

  const points = shape === "polygon" ? [...path, path[0]] : path;
  const style =
    shape === "polygon"
      ? "color:0x005C84ff|weight:3|fillcolor:0xF2B23355"
      : "color:0xF2B233ff|weight:5";

  return `${style}|${points.map((point) => `${point.lat},${point.lng}`).join("|")}`;
};

const buildMapImageUrl = (
  coordinates?: { lat: number; lng: number } | null,
  areas: Array<{ path?: Array<{ lat: number; lng: number }>; shape?: "polygon" | "polyline" | "manual" }> = []
) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey || !coordinates) return undefined;

  const position = `${coordinates.lat},${coordinates.lng}`;
  const params = new URLSearchParams({
    center: position,
    zoom: "19",
    size: "640x360",
    scale: "2",
    maptype: "satellite",
    markers: `color:blue|${position}`,
    key: apiKey,
  });

  areas
    .map((area) => formatMapPath(area.path, area.shape))
    .filter((path): path is string => Boolean(path))
    .forEach((path) => params.append("path", path));

  return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
};

export async function POST(request: Request) {
  // 10 quote submissions per IP per 5 minutes
  const { allowed } = rateLimit(getIP(request), { limit: 10, windowMs: 5 * 60_000 });
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = quoteSchema.parse(body);
    const coordinates = parsed.coordinates ?? undefined;

    await dbConnect();

    let customer = await Customer.findOne({ email: parsed.email });
    if (!customer) {
      customer = await Customer.create({
        name: parsed.name,
        surname: parsed.surname,
        email: parsed.email,
        phone: parsed.phone,
        companyName: parsed.companyName,
        companyRegNumber: parsed.companyRegNumber,
        vatNumber: parsed.vatNumber,
      });
    } else {
      const updates: Record<string, string | undefined> = {};
      if (customer.name !== parsed.name) updates.name = parsed.name;
      if (customer.surname !== parsed.surname) updates.surname = parsed.surname;
      if (customer.phone !== parsed.phone) updates.phone = parsed.phone;
      if (parsed.companyName && customer.companyName !== parsed.companyName) {
        updates.companyName = parsed.companyName;
      }
      if (parsed.companyRegNumber && customer.companyRegNumber !== parsed.companyRegNumber) {
        updates.companyRegNumber = parsed.companyRegNumber;
      }
      if (parsed.vatNumber && customer.vatNumber !== parsed.vatNumber) {
        updates.vatNumber = parsed.vatNumber;
      }
      if (Object.keys(updates).length > 0) {
        customer.set(updates);
        await customer.save();
      }
    }

    let property = await Property.findOne({ address: parsed.address, customerId: customer._id });
    if (!property) {
      property = await Property.create({
        customerId: customer._id,
        address: parsed.address,
        suburb: parsed.address,
        coordinates,
        propertyType: parsed.propertyType,
      });
    } else {
      const shouldUpdatePropertyType = property.propertyType !== parsed.propertyType;
      const shouldUpdateCoordinates = !property.coordinates && coordinates;
      if (shouldUpdatePropertyType || shouldUpdateCoordinates) {
        if (shouldUpdatePropertyType) {
          property.propertyType = parsed.propertyType;
        }
        if (shouldUpdateCoordinates) {
          property.coordinates = coordinates;
        }
        await property.save();
      }
    }

    const pricing = await calculateQuote(parsed.areas);
    const settings = await SiteSettings.findOne();
    const startNumber = Number(settings?.quoteNumberStart ?? 1) || 1;
    await QuoteSequence.findOneAndUpdate(
      { key: "quote" },
      { $setOnInsert: { nextNumber: startNumber - 1 } },
      { upsert: true, new: true }
    );
    const sequence = await QuoteSequence.findOneAndUpdate(
      { key: "quote" },
      { $inc: { nextNumber: 1 } },
      { new: true }
    );
    if (!sequence) {
      throw new Error("Unable to generate quote number");
    }
    const quoteNumberValue = sequence.nextNumber;
    const quoteNumber = `QU${quoteNumberValue.toString().padStart(4, "0")}`;
    const dueDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    const quote = await Quote.create({
      customerId: customer._id,
      propertyId: property._id,
      areas: parsed.areas,
      notes: parsed.notes,
      status: "Pending",
      totalAmount: pricing.total,
      currency: "ZAR",
      leadSource: "Website Self-Quote",
      geo: coordinates,
      mapImageUrl: buildMapImageUrl(coordinates, parsed.areas),
      quoteNumber,
      reference: quoteNumber,
      dueDate,
    });

    return NextResponse.json({
      quoteId: quote._id.toString(),
      quoteNumber,
      totalAmount: pricing.total,
      lineItems: pricing.items,
      minimumFee: pricing.minimumFee,
      vatIncluded: pricing.vatIncluded,
      vatRate: pricing.vatRate,
      vatAmount: pricing.vatAmount,
    });
  } catch (error: any) {
    console.error(error);
    // Surface Zod validation errors as readable field messages
    if (error?.name === "ZodError" || error?.issues) {
      const issues = error.issues ?? [];
      const details = issues.map((i: any) => `${i.path.join(".")}: ${i.message}`).join("; ");
      return NextResponse.json({ error: "Validation failed", details: details || "Invalid input" }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Unable to create quote", details: message }, { status: 400 });
  }
}

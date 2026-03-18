import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Testimonial } from "@/lib/models/Testimonial";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");
  await dbConnect();
  const filter = featured ? { featured: featured === "true" } : {};
  const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 }).limit(10);
  return NextResponse.json(testimonials);
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const testimonial = await Testimonial.create(body);
    return NextResponse.json(testimonial);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to save testimonial" }, { status: 500 });
  }
}

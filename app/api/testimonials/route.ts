import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/db";
import { Testimonial } from "@/lib/models/Testimonial";
import { requireAdminApi } from "@/lib/adminAuth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");
  await dbConnect();
  const filter = featured ? { featured: featured === "true" } : {};
  const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 }).limit(10);
  return NextResponse.json(testimonials);
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    await dbConnect();
    const body = await request.json();
    const testimonial = await Testimonial.create(body);
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return NextResponse.json(testimonial);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to save testimonial" }, { status: 500 });
  }
}

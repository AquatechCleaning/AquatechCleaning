import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Testimonial } from "@/lib/models/Testimonial";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    await dbConnect();
    const data = await request.json();
    const { id } = await params;
    const updated = await Testimonial.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to update testimonial" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  try {
    await dbConnect();
    const { id } = await params;
    await Testimonial.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to delete testimonial" }, { status: 500 });
  }
}

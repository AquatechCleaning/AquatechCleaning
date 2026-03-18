import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Testimonial } from "@/lib/models/Testimonial";

type Params = { params: { id: string } };

export async function PUT(request: Request, { params }: Params) {
  try {
    await dbConnect();
    const data = await request.json();
    const updated = await Testimonial.findByIdAndUpdate(params.id, data, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to update testimonial" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await dbConnect();
    await Testimonial.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to delete testimonial" }, { status: 500 });
  }
}

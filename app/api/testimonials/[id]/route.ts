import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/db";
import { Testimonial } from "@/lib/models/Testimonial";
import { requireAdminApi } from "@/lib/adminAuth";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteContext) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    await dbConnect();
    const data = await request.json();
    const { id } = await params;
    const updated = await Testimonial.findByIdAndUpdate(id, data, { new: true });
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to update testimonial" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    await dbConnect();
    const { id } = await params;
    await Testimonial.findByIdAndDelete(id);
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to delete testimonial" }, { status: 500 });
  }
}

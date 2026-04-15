import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Lead } from "@/lib/models/Lead";
import { contactSchema } from "@/lib/validators";
import { sendEmailStub } from "@/lib/email";
import { rateLimit, getIP } from "@/lib/rateLimit";

export async function POST(request: Request) {
  // 5 submissions per IP per minute
  const { allowed } = rateLimit(getIP(request), { limit: 5, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  try {
    const json = await request.json();
    const parsed = contactSchema.parse(json);
    await dbConnect();

    const lead = await Lead.create({
      ...parsed,
      source: "Contact Form",
    });

    await sendEmailStub({
      to: process.env.CONTACT_EMAIL || "admin@example.com",
      subject: "New lead from Aquatech Cleaning site",
      text: `${parsed.name} (${parsed.email}) requested contact: ${parsed.message}`,
    });

    return NextResponse.json({ success: true, leadId: lead._id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to submit contact form" }, { status: 400 });
  }
}

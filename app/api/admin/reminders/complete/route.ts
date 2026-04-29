import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Reminder } from "@/lib/models/Reminder";
import { requireAdminApi } from "@/lib/adminAuth";

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const { reminderId } = body as { reminderId?: string };

    if (!reminderId) {
      return NextResponse.json({ error: "reminderId required" }, { status: 400 });
    }

    await dbConnect();
    const reminder = await Reminder.findById(reminderId);
    if (!reminder) return NextResponse.json({ error: "Reminder not found" }, { status: 404 });

    reminder.status = "Completed";
    reminder.lastSentAt = new Date();
    await reminder.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Unable to complete reminder", details: message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Reminder } from "@/lib/models/Reminder";
import { requireAdminApi } from "@/lib/adminAuth";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  await dbConnect();
  const reminders = await Reminder.find().sort({ dueDate: 1 }).limit(50);
  return NextResponse.json(reminders);
}

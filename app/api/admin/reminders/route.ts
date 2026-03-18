import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Reminder } from "@/lib/models/Reminder";

export async function GET() {
  await dbConnect();
  const reminders = await Reminder.find().sort({ dueDate: 1 }).limit(50);
  return NextResponse.json(reminders);
}

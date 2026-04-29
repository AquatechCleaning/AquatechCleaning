import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Reminder } from "@/lib/models/Reminder";
import { Job } from "@/lib/models/Job";
import { Customer } from "@/lib/models/Customer";
import { sendEmailStub } from "@/lib/email";
import { requireAdminApi } from "@/lib/adminAuth";

export async function POST() {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    await dbConnect();
    const now = new Date();
    const reminders = await Reminder.find({ dueDate: { $lte: now }, status: "Pending" });

    for (const reminder of reminders) {
      const job = await Job.findById(reminder.jobId);
      const customer = await Customer.findById(reminder.customerId);
      if (!job || !customer) continue;

      await sendEmailStub({
        to: customer.email,
        subject: "Aquatech Cleaning maintenance reminder",
        text: `Hi ${customer.name}, it has been six months since we cleaned your property. Would you like to schedule a maintenance clean?`,
      });

      reminder.status = "Sent";
      reminder.lastSentAt = new Date();
      await reminder.save();
    }

    return NextResponse.json({ processed: reminders.length });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to run reminders" }, { status: 500 });
  }
}

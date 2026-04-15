import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Job } from "@/lib/models/Job";
import { Reminder } from "@/lib/models/Reminder";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jobId } = body as { jobId?: string };

    if (!jobId) {
      return NextResponse.json({ error: "jobId required" }, { status: 400 });
    }

    await dbConnect();
    const job = await Job.findById(jobId);
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    const completedDate = job.completedDate ?? new Date();
    job.status = "Completed";
    job.completedDate = completedDate;
    await job.save();

    const dueDate = new Date(completedDate);
    dueDate.setMonth(dueDate.getMonth() + 6);

    await Reminder.findOneAndUpdate(
      { jobId: job._id, customerId: job.customerId },
      {
        $setOnInsert: {
          jobId: job._id,
          customerId: job.customerId,
          dueDate,
          status: "Pending",
          channel: "email",
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, completedDate, reminderDueDate: dueDate });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Unable to complete job", details: message }, { status: 500 });
  }
}

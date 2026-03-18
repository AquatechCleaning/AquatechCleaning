import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Job } from "@/lib/models/Job";

export async function GET() {
  try {
    await dbConnect();
    const jobs = await Job.find().sort({ createdAt: -1 }).limit(100);
    return NextResponse.json(jobs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to fetch jobs" }, { status: 500 });
  }
}

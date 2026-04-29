import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Job } from "@/lib/models/Job";
import { requireAdminApi } from "@/lib/adminAuth";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    await dbConnect();
    const jobs = await Job.find().sort({ createdAt: -1 }).limit(100);
    return NextResponse.json(jobs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to fetch jobs" }, { status: 500 });
  }
}

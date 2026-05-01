import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Job } from "@/lib/models/Job";

const BASE_CLIENTS_SERVED = 543;
const BASE_SQM_CLEANED = 80000;
const AVERAGE_RATING = 5.0;
const RETURN_RATE = 90;

export async function GET() {
  try {
    await dbConnect();

    const completedJobs = await Job.find({ status: "Completed" }).select("totalAreaSqm");
    const clientsServed = BASE_CLIENTS_SERVED + completedJobs.length;
    const totalSqmCleaned =
      BASE_SQM_CLEANED + completedJobs.reduce((sum, job) => sum + (job.totalAreaSqm || 0), 0);

    return NextResponse.json({
      clientsServed,
      totalSqmCleaned: Math.round(totalSqmCleaned),
      averageRating: AVERAGE_RATING,
      repeatCustomerRate: RETURN_RATE,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      clientsServed: BASE_CLIENTS_SERVED,
      totalSqmCleaned: BASE_SQM_CLEANED,
      averageRating: AVERAGE_RATING,
      repeatCustomerRate: RETURN_RATE,
    });
  }
}

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Job } from "@/lib/models/Job";
import { Customer } from "@/lib/models/Customer";

export async function GET() {
  try {
    await dbConnect();

    const completedJobs = await Job.find({ status: "Completed" });
    const customerIds = new Set(completedJobs.map((j) => j.customerId.toString()));
    const clientsServed = customerIds.size;
    const totalSqmCleaned = completedJobs.reduce((sum, job) => sum + (job.totalAreaSqm || 0), 0);
    const ratings = completedJobs.filter((j) => typeof j.rating === "number").map((j) => j.rating!);
    const averageRating =
      ratings.length > 0
        ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1))
        : 0;

    const repeatCustomers = await Customer.aggregate([
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "customerId",
          as: "jobs",
        },
      },
      { $project: { jobsCount: { $size: "$jobs" } } },
      { $match: { jobsCount: { $gt: 1 } } },
    ]);
    const repeatCustomerJobs = completedJobs.filter((job) =>
      repeatCustomers.find((c) => c._id?.toString() === job.customerId.toString())
    );
    const repeatCustomerRate =
      completedJobs.length === 0
        ? 0
        : Math.round((repeatCustomerJobs.length / completedJobs.length) * 100);

    return NextResponse.json({
      clientsServed,
      totalSqmCleaned: Math.round(totalSqmCleaned),
      averageRating,
      repeatCustomerRate,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { clientsServed: 0, totalSqmCleaned: 0, averageRating: 0, repeatCustomerRate: 0 },
      { status: 200 }
    );
  }
}

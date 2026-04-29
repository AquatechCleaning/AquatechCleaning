import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Quote } from "@/lib/models/Quote";
import { Job } from "@/lib/models/Job";
import { Customer } from "@/lib/models/Customer";
import { requireAdminApi } from "@/lib/adminAuth";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  try {
    await dbConnect();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const quotesThisMonth = await Quote.find({ createdAt: { $gte: startOfMonth } });
    const accepted = quotesThisMonth.filter((q) => q.status === "Accepted").length;
    const conversionRate =
      quotesThisMonth.length === 0 ? 0 : Math.round((accepted / quotesThisMonth.length) * 100);

    const jobsThisMonth = await Job.find({ createdAt: { $gte: startOfMonth } });
    const revenue = jobsThisMonth.reduce((sum, job) => sum + (job.actualAmountCharged || 0), 0);
    const upcomingJobs = await Job.find({ status: "Scheduled" }).limit(5);

    // simple monthly counts for charts
    const monthlyQuotes = await Quote.aggregate([
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" }, status: "$status" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const retention = await Customer.aggregate([
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "customerId",
          as: "jobs",
        },
      },
      {
        $project: {
          jobsCount: { $size: "$jobs" },
        },
      },
    ]);

    const repeatRate =
      retention.length === 0
        ? 0
        : Math.round(
            (retention.filter((c: any) => c.jobsCount > 1).length / retention.length) * 100
          );

    return NextResponse.json({
      summary: {
        quotesThisMonth: quotesThisMonth.length,
        conversionRate,
        revenue,
        upcomingJobs,
        repeatRate,
      },
      monthlyQuotes,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to fetch analytics" }, { status: 500 });
  }
}

import Link from "next/link";
import { dbConnect } from "@/lib/db";
import { formatCurrency } from "@/lib/format";
import { Customer } from "@/lib/models/Customer";
import { Job } from "@/lib/models/Job";
import { Quote } from "@/lib/models/Quote";

export const dynamic = "force-dynamic";

async function getSummary() {
  await dbConnect();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const quotesThisMonth = await Quote.find({ createdAt: { $gte: startOfMonth } });
  const accepted = quotesThisMonth.filter((quote) => quote.status === "Accepted").length;
  const conversionRate = quotesThisMonth.length === 0 ? 0 : Math.round((accepted / quotesThisMonth.length) * 100);
  const jobsThisMonth = await Job.find({ createdAt: { $gte: startOfMonth } });
  const revenue = jobsThisMonth.reduce((sum, job) => sum + (job.actualAmountCharged || 0), 0);
  const upcomingJobs = await Job.find({ status: "Scheduled" }).sort({ scheduledDate: 1 }).limit(5).lean();
  const retention = await Customer.aggregate([
    { $lookup: { from: "jobs", localField: "_id", foreignField: "customerId", as: "jobs" } },
    { $project: { jobsCount: { $size: "$jobs" } } },
  ]);
  const repeatRate =
    retention.length === 0 ? 0 : Math.round((retention.filter((customer) => customer.jobsCount > 1).length / retention.length) * 100);

  return { quotesThisMonth: quotesThisMonth.length, conversionRate, revenue, upcomingJobs, repeatRate };
}

export default async function AdminDashboard() {
  const summary = await getSummary();

  const kpis = [
    { label: "Quotes This Month", value: summary.quotesThisMonth, format: (v: number) => v.toString(), accent: "var(--primary)" },
    { label: "Conversion Rate", value: summary.conversionRate, format: (v: number) => `${v}%`, accent: "var(--accent)" },
    { label: "Revenue (MTD)", value: summary.revenue, format: (v: number) => formatCurrency(v, { decimals: 0 }), accent: "#22c55e" },
    { label: "Repeat Rate", value: summary.repeatRate, format: (v: number) => `${v}%`, accent: "#8b5cf6" },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <p className="ui-kicker">Overview</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 800, color: "var(--navy)", marginTop: "6px" }}>
            Admin Dashboard
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>Quick stats for this month.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
        {kpis.map((k) => (
          <div
            key={k.label}
            className="ui-card"
            style={{ padding: "20px", position: "relative", overflow: "hidden" }}
          >
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", background: k.accent }} />
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "10px" }}>
              {k.label}
            </p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "30px", fontWeight: 800, color: "var(--navy)", lineHeight: 1 }}>
              {k.format(k.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Upcoming jobs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div className="ui-card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--navy)" }}>Upcoming Jobs</h2>
            <Link href="/admin/jobs" style={{ fontSize: "12px", color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>View all →</Link>
          </div>
          {summary.upcomingJobs.length === 0 ? (
            <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>No upcoming jobs scheduled.</div>
          ) : (
            summary.upcomingJobs.map((job) => (
              <div
                key={job._id.toString()}
                style={{
                  padding: "12px 20px",
                  borderBottom: "1px solid var(--bg)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: "13px", fontWeight: 600, color: "var(--navy)" }}>{job.teamName || "Team TBD"}</span>
                <span style={{ fontSize: "11px", background: "#EFF6FF", color: "var(--primary)", padding: "2px 8px", borderRadius: "100px", fontWeight: 600 }}>
                  {job.servicesPerformed?.[0]?.type?.replace("_", " ") || "General"}
                </span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString("en-ZA") : "Unscheduled"}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Quick links */}
        <div className="ui-card" style={{ padding: "20px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--navy)", marginBottom: "16px" }}>Quick Actions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { href: "/admin/quotes", label: "Review pending quotes", icon: "📋" },
              { href: "/admin/media", label: "Upload before/after photos", icon: "🖼" },
              { href: "/admin/testimonials", label: "Add client testimonial", icon: "💬" },
              { href: "/admin/pricing", label: "Update service pricing", icon: "💰" },
              { href: "/admin/reminders", label: "Send due reminders", icon: "⏰" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "var(--navy)",
                  textDecoration: "none",
                }}
              >
                <span style={{ fontSize: "16px" }}>{item.icon}</span>
                {item.label}
                <span style={{ marginLeft: "auto", color: "var(--text-soft)" }}>→</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

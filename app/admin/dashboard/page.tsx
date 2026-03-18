async function getSummary() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/admin/analytics`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function AdminDashboard() {
  const data = await getSummary();

  const summary = data?.summary || {
    quotesThisMonth: 0,
    conversionRate: 0,
    revenue: 0,
    upcomingJobs: [],
    repeatRate: 0,
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="ui-kicker">Overview</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#02203D]">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Quick stats for this month.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="ui-card p-5">
          <p className="text-sm text-slate-500">Quotes (this month)</p>
          <p className="mt-1 text-3xl font-semibold text-[#02203D]">{summary.quotesThisMonth}</p>
        </div>
        <div className="ui-card p-5">
          <p className="text-sm text-slate-500">Conversion rate</p>
          <p className="mt-1 text-3xl font-semibold text-[#02203D]">{summary.conversionRate}%</p>
        </div>
        <div className="ui-card p-5">
          <p className="text-sm text-slate-500">Revenue (this month)</p>
          <p className="mt-1 text-3xl font-semibold text-[#02203D]">R{summary.revenue.toLocaleString()}</p>
        </div>
      </div>
      <div className="ui-card p-5">
        <h2 className="text-lg font-semibold text-[#02203D]">Upcoming jobs</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {summary.upcomingJobs.length === 0 && <li className="text-slate-500">No upcoming jobs yet.</li>}
          {summary.upcomingJobs.map((job: any) => (
            <li key={job._id} className="flex items-center justify-between rounded-xl border border-[#d2d5c6] bg-white px-3 py-2">
              <span>{job.teamName || "Team TBD"}</span>
              <span className="text-slate-500">
                {job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString() : "Unscheduled"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

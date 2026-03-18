async function getJobs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/admin/jobs`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Jobs</h1>
        <p className="text-sm text-slate-600">Track scheduled and completed work.</p>
      </div>
      <div className="overflow-hidden ui-card">
        <table className="ui-table min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Job</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Status</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Team</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Completed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.map((job: any) => (
              <tr key={job._id}>
                <td className="px-4 py-3">{job._id}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full border border-[#d2d5c6] bg-[#f8fafc] px-3 py-1 text-xs font-semibold uppercase text-slate-700">
                    {job.status}
                  </span>
                </td>
                <td className="px-4 py-3">{job.teamName || "Unassigned"}</td>
                <td className="px-4 py-3">
                  {job.completedDate ? new Date(job.completedDate).toLocaleDateString() : "-"}
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan={4}>
                  No jobs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


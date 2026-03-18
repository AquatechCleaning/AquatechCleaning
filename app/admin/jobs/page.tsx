async function getJobs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/admin/jobs`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Scheduled: "ui-badge-scheduled",
    Completed: "ui-badge-completed",
    Cancelled: "ui-badge-declined",
  };
  return (
    <span className={`ui-badge ${map[status] ?? "ui-badge-expired"}`}>
      <span className="ui-status-dot" />
      {status}
    </span>
  );
}

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <p className="ui-kicker">Operations</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 800, color: "var(--navy)", marginTop: "6px" }}>
            Jobs
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
            Track scheduled and completed work.
          </p>
        </div>
      </div>

      <div className="ui-card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="ui-table">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Team</th>
                <th>Status</th>
                <th>Scheduled</th>
                <th>Completed</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job: any) => (
                <tr key={job._id}>
                  <td style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--text-muted)" }}>
                    #{job._id.slice(-8)}
                  </td>
                  <td style={{ fontWeight: 600, color: "var(--navy)" }}>
                    {job.teamName || (
                      <span style={{ color: "var(--text-soft)", fontStyle: "italic" }}>Unassigned</span>
                    )}
                  </td>
                  <td><StatusBadge status={job.status} /></td>
                  <td style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                    {job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString("en-ZA") : "—"}
                  </td>
                  <td style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                    {job.completedDate ? new Date(job.completedDate).toLocaleDateString("en-ZA") : "—"}
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "48px", color: "var(--text-muted)", fontSize: "13px" }}>
                    No jobs yet. Jobs are created when quotes are accepted.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

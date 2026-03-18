async function getSummary() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/admin/analytics`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function AdminDashboard() {
  const data = await getSummary();
  const summary = data?.summary || { quotesThisMonth: 0, conversionRate: 0, revenue: 0, upcomingJobs: [], repeatRate: 0 };

  const kpis = [
    { label: "Quotes This Month", value: summary.quotesThisMonth, format: (v: number) => v.toString(), accent: "var(--primary)" },
    { label: "Conversion Rate", value: summary.conversionRate, format: (v: number) => `${v}%`, accent: "var(--accent)" },
    { label: "Revenue (MTD)", value: summary.revenue, format: (v: number) => `R${v.toLocaleString()}`, accent: "#22c55e" },
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
            <a href="/admin/jobs" style={{ fontSize: "12px", color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>View all →</a>
          </div>
          {summary.upcomingJobs.length === 0 ? (
            <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>No upcoming jobs scheduled.</div>
          ) : (
            summary.upcomingJobs.map((job: any) => (
              <div
                key={job._id}
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
                  {job.serviceType || "General"}
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

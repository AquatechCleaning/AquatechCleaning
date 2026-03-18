"use client";

import { useEffect, useState } from "react";

type Reminder = { _id: string; dueDate: string; status: string; jobId: string; customerId: string };

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch("/api/admin/reminders");
    const data = await res.json();
    setReminders(Array.isArray(data) ? data : []);
  };

  useEffect(() => { load(); }, []);

  const runJob = async () => {
    setLoading(true);
    await fetch("/api/reminders/run", { method: "POST" });
    await load();
    setLoading(false);
  };

  const statusClass: Record<string, string> = {
    Pending: "ui-badge-pending",
    Sent: "ui-badge-sent",
    Snoozed: "ui-badge-scheduled",
    Cancelled: "ui-badge-declined",
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <p className="ui-kicker">Operations</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 800, color: "var(--navy)", marginTop: "6px" }}>Reminders</h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>Maintenance follow-up reminders after completed jobs.</p>
        </div>
        <button
          className="ui-btn ui-btn-secondary"
          onClick={runJob}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Running…" : "⏰ Send Due Reminders"}
        </button>
      </div>

      <div className="ui-card" style={{ overflow: "hidden" }}>
        <table className="ui-table">
          <thead>
            <tr>
              <th>Due Date</th>
              <th>Status</th>
              <th>Job</th>
              <th>Customer</th>
            </tr>
          </thead>
          <tbody>
            {reminders.map((r) => (
              <tr key={r._id}>
                <td style={{ fontWeight: 600, color: "var(--navy)" }}>
                  {r.dueDate ? new Date(r.dueDate).toLocaleDateString("en-ZA") : "—"}
                </td>
                <td>
                  <span className={`ui-badge ${statusClass[r.status] ?? "ui-badge-expired"}`}>
                    <span className="ui-status-dot" />
                    {r.status}
                  </span>
                </td>
                <td style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--text-muted)" }}>
                  #{String(r.jobId).slice(-8)}
                </td>
                <td style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--text-muted)" }}>
                  #{String(r.customerId).slice(-8)}
                </td>
              </tr>
            ))}
            {reminders.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "48px", color: "var(--text-muted)", fontSize: "13px" }}>
                  No reminders yet. They&apos;re created automatically after jobs are completed.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

type Reminder = {
  _id: string;
  dueDate: string;
  status: string;
  jobId: string;
  customerId: string;
};

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch("/api/admin/reminders");
    const data = await res.json();
    setReminders(data);
  };

  useEffect(() => {
    load();
  }, []);

  const runReminderJob = async () => {
    setLoading(true);
    await fetch("/api/reminders/run", { method: "POST" });
    await load();
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Reminders</h1>
        <p className="text-sm text-slate-600">Maintenance follow-ups after completed jobs.</p>
      </div>
      <button
        onClick={runReminderJob}
        className="ui-btn ui-btn-secondary"
        disabled={loading}
      >
        {loading ? "Running..." : "Send due reminders"}
      </button>
      <div className="overflow-hidden ui-card">
        <table className="ui-table min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Due date</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Status</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Job</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reminders.map((reminder) => (
              <tr key={reminder._id}>
                <td className="px-4 py-3">
                  {reminder.dueDate ? new Date(reminder.dueDate).toLocaleDateString() : ""}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full border border-[#d2d5c6] bg-[#f8fafc] px-3 py-1 text-xs font-semibold uppercase text-slate-700">
                    {reminder.status}
                  </span>
                </td>
                <td className="px-4 py-3">{reminder.jobId}</td>
              </tr>
            ))}
            {reminders.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan={3}>
                  No reminders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


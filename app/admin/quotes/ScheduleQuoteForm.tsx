"use client";

import { useState } from "react";

type ScheduleType = "half_day" | "full_day" | "multiple_days";
type ScheduleSlot = "morning" | "afternoon";

export function ScheduleQuoteForm({ quoteId }: { quoteId: string }) {
  const [scheduleType, setScheduleType] = useState<ScheduleType>("half_day");
  const [scheduleSlot, setScheduleSlot] = useState<ScheduleSlot>("morning");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [teamName, setTeamName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const schedule = async () => {
    if (!startDate) {
      setStatus("error");
      setMessage("Choose a start date.");
      return;
    }

    if (scheduleType === "multiple_days" && !endDate) {
      setStatus("error");
      setMessage("Choose an end date.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/admin/quotes/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId,
          scheduleType,
          scheduleSlot: scheduleType === "half_day" ? scheduleSlot : undefined,
          startDate,
          endDate: scheduleType === "multiple_days" ? endDate : undefined,
          teamName: teamName.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error || "Unable to schedule quote.");

      setStatus("success");
      setMessage("Scheduled. Refreshing...");
      window.location.reload();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to schedule quote.");
    }
  };

  const inputStyle = {
    border: "1px solid var(--border)",
    borderRadius: "6px",
    fontSize: "11px",
    minWidth: 0,
    padding: "5px 8px",
  };

  return (
    <div style={{ display: "grid", gap: "6px", minWidth: "330px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
        <select value={scheduleType} onChange={(e) => setScheduleType(e.target.value as ScheduleType)} style={inputStyle}>
          <option value="half_day">Half day</option>
          <option value="full_day">Full day</option>
          <option value="multiple_days">Multiple days</option>
        </select>
        {scheduleType === "half_day" ? (
          <select value={scheduleSlot} onChange={(e) => setScheduleSlot(e.target.value as ScheduleSlot)} style={inputStyle}>
            <option value="morning">8am to 12pm</option>
            <option value="afternoon">1pm to 5pm</option>
          </select>
        ) : (
          <input
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Team"
            style={inputStyle}
          />
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: scheduleType === "multiple_days" ? "1fr 1fr" : "1fr", gap: "6px" }}>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle} />
        {scheduleType === "multiple_days" ? (
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={inputStyle} />
        ) : null}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: scheduleType === "half_day" ? "1fr auto" : "auto", gap: "6px" }}>
        {scheduleType === "half_day" ? (
          <input
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Team"
            style={inputStyle}
          />
        ) : null}
        <button
          type="button"
          onClick={schedule}
          disabled={status === "loading"}
          style={{
            background: "var(--primary)",
            border: "none",
            borderRadius: "6px",
            color: "#fff",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: 700,
            padding: "5px 10px",
          }}
        >
          Schedule
        </button>
      </div>
      {message && (
        <p style={{ color: status === "error" ? "#991b1b" : "#166534", fontSize: "11px" }}>
          {message}
        </p>
      )}
    </div>
  );
}

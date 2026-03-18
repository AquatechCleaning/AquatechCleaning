"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type MonthlyQuote = { _id: { year: number; month: number; status: string }; count: number };

export default function AnalyticsPage() {
  const [data, setData] = useState<{ monthlyQuotes: MonthlyQuote[] }>({ monthlyQuotes: [] });

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((json) => setData({ monthlyQuotes: Array.isArray(json?.monthlyQuotes) ? json.monthlyQuotes : [] }))
      .catch(() => setData({ monthlyQuotes: [] }));
  }, []);

  const monthlyQuotes = data.monthlyQuotes;

  const monthlyTotals = Object.values(
    monthlyQuotes.reduce((acc: any, item) => {
      const key = `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
      if (!acc[key]) acc[key] = { month: `${item._id.month}/${item._id.year}`, total: 0 };
      acc[key].total += item.count;
      return acc;
    }, {})
  ) as { month: string; total: number }[];

  const monthlyAccepted = Object.values(
    monthlyQuotes.reduce((acc: any, item) => {
      if (item._id.status !== "Accepted") return acc;
      const key = `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
      if (!acc[key]) acc[key] = { month: `${item._id.month}/${item._id.year}`, accepted: 0 };
      acc[key].accepted += item.count;
      return acc;
    }, {})
  ) as { month: string; accepted: number }[];

  const cardStyle = {
    background: "#fff",
    border: "1px solid var(--border)",
    borderRadius: "var(--r-lg)",
    overflow: "hidden",
  };
  const headerStyle = {
    padding: "16px 20px",
    borderBottom: "1px solid var(--border)",
    fontFamily: "var(--font-display)",
    fontSize: "15px",
    fontWeight: 700,
    color: "var(--navy)",
  };

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <p className="ui-kicker">Reporting</p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 800, color: "var(--navy)", marginTop: "6px" }}>
          Analytics
        </h1>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
          Quote volumes and conversion trends over time.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={cardStyle}>
          <div style={headerStyle}>Quotes per Month</div>
          <div style={{ padding: "20px", height: "280px" }}>
            {monthlyTotals.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)", fontSize: "13px" }}>
                No data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTotals}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                  <Tooltip
                    contentStyle={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }}
                  />
                  <Line type="monotone" dataKey="total" stroke="var(--primary)" strokeWidth={2.5} dot={{ fill: "var(--primary)", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={headerStyle}>Accepted Quotes per Month</div>
          <div style={{ padding: "20px", height: "280px" }}>
            {monthlyAccepted.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)", fontSize: "13px" }}>
                No data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyAccepted}>
                  <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                  <Tooltip
                    contentStyle={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }}
                  />
                  <Bar dataKey="accepted" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

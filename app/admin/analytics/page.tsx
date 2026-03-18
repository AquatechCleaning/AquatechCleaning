"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

type MonthlyQuote = {
  _id: { year: number; month: number; status: string };
  count: number;
};

export default function AnalyticsPage() {
  const [data, setData] = useState<{ monthlyQuotes: MonthlyQuote[] }>({ monthlyQuotes: [] });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/analytics");
        const json = await res.json();
        const monthlyQuotes = Array.isArray(json?.monthlyQuotes) ? json.monthlyQuotes : [];
        setData({ monthlyQuotes });
      } catch {
        setData({ monthlyQuotes: [] });
      }
    };
    load();
  }, []);

  const monthlyQuotes = Array.isArray(data.monthlyQuotes) ? data.monthlyQuotes : [];

  const monthlyTotals = Object.values(
    monthlyQuotes.reduce((acc: any, item) => {
      const key = `${item._id.year}-${item._id.month}`;
      if (!acc[key]) acc[key] = { month: `${item._id.month}/${item._id.year}`, total: 0 };
      acc[key].total += item.count;
      return acc;
    }, {})
  );

  const monthlyAccepted = Object.values(
    monthlyQuotes.reduce((acc: any, item) => {
      if (item._id.status !== "Accepted") return acc;
      const key = `${item._id.year}-${item._id.month}`;
      if (!acc[key]) acc[key] = { month: `${item._id.month}/${item._id.year}`, accepted: 0 };
      acc[key].accepted += item.count;
      return acc;
    }, {})
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-600">Quotes over time and conversion trends.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="ui-card p-4">
          <h3 className="text-sm font-semibold text-slate-800">Quotes per month</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTotals}>
                <Line type="monotone" dataKey="total" stroke="#0284c7" strokeWidth={2} />
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="ui-card p-4">
          <h3 className="text-sm font-semibold text-slate-800">Accepted quotes per month</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyAccepted}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="accepted" fill="#0ea5e9" radius={6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-500">
        TODO: add conversion by lead source, jobs per team, retention over time, and interactive map with
        status-colored pins.
      </p>
    </div>
  );
}


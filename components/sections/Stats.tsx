import { StatsBlock } from "./StatsBlock";

type PublicStats = {
  clientsServed: number;
  totalSqmCleaned: number;
  averageRating: number;
  repeatCustomerRate: number;
};

async function getStats(): Promise<PublicStats> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";
  const url = new URL("/api/stats/public", base).toString();

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    return { clientsServed: 0, totalSqmCleaned: 0, averageRating: 0, repeatCustomerRate: 0 };
  }
  return res.json();
}

export async function Stats() {
  const stats = await getStats();

  const items = [
    { label: "Clients Served", value: stats.clientsServed },
    { label: "Total m² Cleaned", value: stats.totalSqmCleaned, decimals: 0 },
    { label: "Average Rating", value: stats.averageRating, suffix: " / 5.0", decimals: 1 },
    { label: "Repeat Customers", value: stats.repeatCustomerRate, suffix: "%", decimals: 0 },
  ];

  return (
    <section className="mx-auto mt-16 max-w-6xl px-4 reveal-up">
      <h2 className="text-2xl font-semibold text-[#02203D]">Proof in the numbers</h2>
      <p className="mt-1 text-sm text-slate-600">
        Live KPIs pulled from completed jobs and customer feedback.
      </p>
      <div className="mt-5 rounded-3xl border border-[#d2d5c6] bg-white p-3 shadow-[0_12px_28px_rgba(2,32,61,0.08)]">
        <StatsBlock stats={items} />
      </div>
    </section>
  );
}

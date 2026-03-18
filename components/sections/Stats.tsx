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
  try {
    const res = await fetch(new URL("/api/stats/public", base).toString(), {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    return {
      clientsServed: 0,
      totalSqmCleaned: 0,
      averageRating: 0,
      repeatCustomerRate: 0,
    };
  }
}

export async function Stats() {
  const stats = await getStats();

  const items = [
    { label: "Clients Served",    value: stats.clientsServed,       suffix: "+" },
    { label: "Total m² Cleaned",  value: stats.totalSqmCleaned,     suffix: "+", decimals: 0 },
    { label: "Average Rating",    value: stats.averageRating,       suffix: " / 5.0", decimals: 1 },
    { label: "Repeat Customers",  value: stats.repeatCustomerRate,  suffix: "%", decimals: 0 },
  ];

  return (
    <section
      style={{
        background: "#fff",
        borderBottom: "1px solid var(--border)",
        padding: "32px 0",
      }}
    >
      <div className="ui-container">
        <StatsBlock stats={items} />
      </div>
    </section>
  );
}

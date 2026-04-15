import { formatCurrency } from "@/lib/format";
import { ScheduleQuoteForm } from "./ScheduleQuoteForm";

async function getQuotes() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/admin/quotes`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Pending: "ui-badge-pending",
    Sent: "ui-badge-sent",
    Accepted: "ui-badge-accepted",
    Scheduled: "ui-badge-scheduled",
    Declined: "ui-badge-declined",
    "Callback Requested": "ui-badge-sent",
    Expired: "ui-badge-expired",
  };
  return (
    <span className={`ui-badge ${map[status] ?? "ui-badge-expired"}`}>
      <span className="ui-status-dot" />
      {status}
    </span>
  );
}

function initials(id: string) {
  return id.slice(-2).toUpperCase();
}

export default async function QuotesPage() {
  const quotes = await getQuotes();

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <p className="ui-kicker">Operations</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 800, color: "var(--navy)", marginTop: "6px" }}>
            Quotes
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
            Manage inbound self-serve quote requests.
          </p>
        </div>
      </div>

      {/* Summary counts */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {["All", "Pending", "Sent", "Accepted", "Scheduled", "Declined", "Callback Requested"].map((s) => {
          const count = s === "All" ? quotes.length : quotes.filter((q: any) => q.status === s).length;
          return (
            <div
              key={s}
              style={{
                padding: "5px 14px",
                borderRadius: "100px",
                fontSize: "12px",
                fontWeight: 600,
                background: s === "All" ? "var(--primary)" : "#fff",
                color: s === "All" ? "#fff" : "var(--text-muted)",
                border: "1px solid var(--border)",
              }}
            >
              {s} ({count})
            </div>
          );
        })}
      </div>

      <div className="ui-card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="ui-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Services</th>
                <th>Total</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote: any) => (
                <tr key={quote._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          background: "#EFF6FF",
                          color: "var(--primary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "10px",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {initials(quote._id)}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, color: "var(--navy)", fontSize: "13px" }}>{quote.customerId}</p>
                        <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>#{quote.quoteNumber ?? quote._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                      {(quote.areas ?? []).slice(0, 3).map((a: any) => (
                        <span
                          key={a.type}
                          style={{
                            fontSize: "10px",
                            background: "var(--surface-2)",
                            border: "1px solid var(--border)",
                            borderRadius: "100px",
                            padding: "2px 8px",
                            fontWeight: 600,
                            color: "var(--text-muted)",
                            textTransform: "capitalize",
                          }}
                        >
                          {a.type}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: "var(--navy)" }}>
                    {typeof quote.totalAmount === "number" ? formatCurrency(quote.totalAmount) : "—"}
                  </td>
                  <td>
                    <StatusBadge status={quote.status} />
                  </td>
                  <td style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                    {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString("en-ZA") : "—"}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px", alignItems: "flex-start" }}>
                      <a
                        href={`/api/quotes/pdf/${quote._id}`}
                        target="_blank"
                        style={{
                          padding: "5px 10px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 600,
                          border: "1px solid var(--border)",
                          background: "#fff",
                          color: "var(--navy)",
                          textDecoration: "none",
                        }}
                      >
                        PDF
                      </a>
                      {quote.status === "Accepted" ? <ScheduleQuoteForm quoteId={quote._id} /> : null}
                    </div>
                  </td>
                </tr>
              ))}
              {quotes.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "48px", color: "var(--text-muted)", fontSize: "13px" }}>
                    No quotes yet. They&apos;ll appear here once customers use the quote tool.
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

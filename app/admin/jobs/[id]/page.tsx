import { dbConnect } from "@/lib/db";
import { Customer } from "@/lib/models/Customer";
import { Job } from "@/lib/models/Job";
import { Property } from "@/lib/models/Property";
import { Quote } from "@/lib/models/Quote";
import { formatCurrency } from "@/lib/format";

type Params = {
  params: Promise<{ id: string }>;
};

const formatService = (value: string) =>
  value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export default async function JobDetailPage({ params }: Params) {
  const { id } = await params;

  await dbConnect();
  const job = await Job.findById(id);

  if (!job) {
    return (
      <div>
        <h1 style={{ fontFamily: "var(--font-display)", color: "var(--navy)" }}>Job not found</h1>
        <a href="/admin/reminders" className="ui-btn ui-btn-ghost" style={{ display: "inline-block", marginTop: "16px" }}>
          Back to reminders
        </a>
      </div>
    );
  }

  const [customer, property, quote] = await Promise.all([
    Customer.findById(job.customerId),
    Property.findById(job.propertyId),
    Quote.findById(job.quoteId),
  ]);

  const services = job.servicesPerformed ?? quote?.areas ?? [];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "24px" }}>
        <div>
          <p className="ui-kicker">Previous Job</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 800, color: "var(--navy)", marginTop: "6px" }}>
            Job #{job._id.toString().slice(-8)}
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
            Completed {job.completedDate ? new Date(job.completedDate).toLocaleDateString("en-ZA") : "date not recorded"}
          </p>
        </div>
        <a href="/admin/reminders" className="ui-btn ui-btn-ghost" style={{ textDecoration: "none" }}>
          Back to reminders
        </a>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "20px", alignItems: "start" }}>
        <div className="ui-card" style={{ padding: "20px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 800, color: "var(--navy)", marginBottom: "14px" }}>
            Job Image
          </h2>
          {quote?.mapImageUrl ? (
            <img
              src={quote.mapImageUrl}
              alt="Previous job map snapshot"
              style={{ width: "100%", borderRadius: "8px", border: "1px solid var(--border)" }}
            />
          ) : (
            <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "8px", padding: "36px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
              No map image saved for this job.
            </div>
          )}
        </div>

        <div style={{ display: "grid", gap: "16px" }}>
          <div className="ui-card" style={{ padding: "20px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 800, color: "var(--navy)", marginBottom: "14px" }}>
              Customer
            </h2>
            <div style={{ display: "grid", gap: "8px", fontSize: "13px", color: "var(--text-muted)" }}>
              <p><strong style={{ color: "var(--navy)" }}>Name:</strong> {customer ? `${customer.name} ${customer.surname}` : "Unknown"}</p>
              <p><strong style={{ color: "var(--navy)" }}>Email:</strong> {customer?.email ?? "Unknown"}</p>
              <p><strong style={{ color: "var(--navy)" }}>Phone:</strong> {customer?.phone ?? "Unknown"}</p>
              {customer?.companyName ? <p><strong style={{ color: "var(--navy)" }}>Company:</strong> {customer.companyName}</p> : null}
            </div>
          </div>

          <div className="ui-card" style={{ padding: "20px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 800, color: "var(--navy)", marginBottom: "14px" }}>
              Property
            </h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>
              {property?.address ?? "No address recorded"}
            </p>
          </div>

          <div className="ui-card" style={{ padding: "20px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 800, color: "var(--navy)", marginBottom: "14px" }}>
              Services
            </h2>
            <div style={{ display: "grid", gap: "8px" }}>
              {services.map((area, index) => (
                <div key={`${area.type}-${index}`} style={{ display: "flex", justifyContent: "space-between", gap: "12px", fontSize: "13px", color: "var(--text-muted)" }}>
                  <span style={{ color: "var(--navy)", fontWeight: 700 }}>{formatService(area.type)}</span>
                  <span>{area.sqm} {area.type === "windows" || area.type === "solar_panels" ? "units" : "m2"}</span>
                </div>
              ))}
              {services.length === 0 ? <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>No services recorded.</p> : null}
            </div>
            <div style={{ borderTop: "1px solid var(--border)", marginTop: "14px", paddingTop: "12px", display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: 800, color: "var(--navy)" }}>
              <span>Total</span>
              <span>{formatCurrency(job.actualAmountCharged ?? quote?.totalAmount ?? 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

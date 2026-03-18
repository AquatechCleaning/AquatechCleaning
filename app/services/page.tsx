import Link from "next/link";

const services = [
  {
    id: "roof",
    icon: "🏠",
    title: "Roof Cleaning",
    description: "Soft-wash systems, anti-moss treatments, and careful pressure for tiles, sheeting, and gutters.",
    bullets: ["Safe access and fall protection", "Moss, lichen, and algae removal", "Gutter clearing and flushing", "Post-clean inspection and photos"],
  },
  {
    id: "driveway",
    icon: "🛣️",
    title: "Driveway & Paving",
    description: "High-pressure cleaning, de-greasing, and re-sanding for driveways, patios, and poolsides.",
    bullets: ["Oil stain and tyre mark removal", "Weed control between joints", "Re-sanding and sealing options", "Careful water management"],
  },
  {
    id: "walls",
    icon: "🏗️",
    title: "Walls & Facades",
    description: "Gentle facade washing to protect paint and waterproofing while removing pollutants.",
    bullets: ["Soft-wash for painted surfaces", "Efflorescence and salt stain removal", "Height access with proper gear", "Windows and trims protected"],
  },
  {
    id: "commercial",
    icon: "🏢",
    title: "Commercial & Industrial",
    description: "Retail parks, warehouses, forecourts, and fleet yards with minimal downtime.",
    bullets: ["After-hours and weekend work", "Water capture on sensitive sites", "Team scaling for tight timelines", "Safety documentation on request"],
  },
  {
    id: "windows",
    icon: "🪟",
    title: "Window Cleaning",
    description: "Streak-free exterior and interior window cleaning for all property types and heights.",
    bullets: ["Purified water fed pole system", "Safe high-reach access", "Frames and sills included", "Residential and commercial"],
  },
  {
    id: "solar",
    icon: "☀️",
    title: "Solar Panel Cleaning",
    description: "Specialist cleaning to restore panel efficiency without scratching surfaces.",
    bullets: ["Non-abrasive soft wash method", "Efficiency assessment before/after", "Roof safety protocols", "Per-panel pricing"],
  },
];

export default function ServicesPage() {
  return (
    <div style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div style={{ background: "var(--navy)", padding: "64px 0 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div className="ui-container" style={{ position: "relative" }}>
          <p className="ui-kicker reveal-up" style={{ color: "var(--accent)" }}>What We Offer</p>
          <h1 className="ui-title reveal-up reveal-up-d1" style={{ color: "#fff", marginTop: "8px", marginBottom: "12px" }}>
            Exterior cleaning built for longevity
          </h1>
          <p className="ui-subtitle reveal-up reveal-up-d2" style={{ color: "rgba(255,255,255,0.65)", maxWidth: "520px" }}>
            Transparent pricing, careful execution, and equipment suited to each surface type.
          </p>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40px", background: "var(--bg)", clipPath: "ellipse(60% 100% at 50% 100%)" }} />
      </div>

      {/* Services grid */}
      <div className="ui-container" style={{ padding: "60px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {services.map((s, i) => (
            <div
              key={s.id}
              id={s.id}
              className={`ui-card reveal-up reveal-up-d${Math.min(i + 1, 4)}`}
              style={{ padding: "28px" }}
            >
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", marginBottom: "16px" }}>
                {s.icon}
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color: "var(--navy)", marginBottom: "10px" }}>
                {s.title}
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "16px" }}>
                {s.description}
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                {s.bullets.map((b) => (
                  <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px", color: "#334155" }}>
                    <span style={{ marginTop: "4px", width: "7px", height: "7px", borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
                    {b}
                  </li>
                ))}
              </ul>
              <Link href="/quote" style={{ fontSize: "13px", fontWeight: 700, color: "var(--primary)", textDecoration: "none" }}>
                Get an instant quote →
              </Link>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="ui-card reveal-up"
          style={{
            marginTop: "40px",
            padding: "40px",
            background: "var(--navy)",
            textAlign: "center",
            border: "none",
          }}
        >
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 800, color: "#fff", marginBottom: "10px" }}>
            Not sure which service you need?
          </h3>
          <p style={{ color: "rgba(255,255,255,0.65)", marginBottom: "24px", fontSize: "14px" }}>
            Use our map-based quote tool to describe your property and we&apos;ll recommend the right approach.
          </p>
          <Link href="/quote" className="ui-btn ui-btn-primary">Build My Quote →</Link>
        </div>
      </div>
    </div>
  );
}

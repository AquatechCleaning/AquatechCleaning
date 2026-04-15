import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services | Roof, Window, Solar & Driveway Cleaning Cape Town",
  description: "Professional roof cleaning, gutter cleaning, solar panel cleaning, window cleaning, driveway washing and deck restoration across Cape Town and the Western Cape.",
  openGraph: {
    title: "Exterior Cleaning Services | Aquatech Cleaning Cape Town",
    description: "Roof, gutter, solar panel, window, driveway and deck cleaning. Professional pressure and soft washing across Cape Town.",
    url: "https://aquatechcleaning.co.za/services",
  },
};

const services = [
  {
    id: "solar",
    icon: "☀️",
    title: "Solar Panel Cleaning",
    description: "Elevate your solar panel cleaning with our RoDi (Reverse Osmosis, De-ionized) technology. Using pure water without chemicals, it ensures optimal efficiency and cleanliness. Unlike tap water, it prevents residue buildup, maintaining peak performance and visual appeal.",
    bullets: ["Pure RoDi water, no chemicals", "Prevents residue buildup", "Maintains peak performance", "Roof safety protocols on every job"],
  },
  {
    id: "windows",
    icon: "🪟",
    title: "Window Cleaning",
    description: "Achieve sparkling windows without chemicals or soaps using our RoDi technology. Our method leaves no residue for dirt to cling to, keeping windows cleaner and shinier for longer. Say goodbye to streaks with our chemical-free solutions.",
    bullets: ["Chemical-free RoDi method", "No streaks or residue", "Windows stay cleaner longer", "Residential and commercial"],
  },
  {
    id: "roof",
    icon: "🏠",
    title: "Roof Cleaning",
    description: "Ensuring the upkeep of your roof's exterior is crucial to prevent damage from organic growth, dirt and debris. Our expert solutions utilise both pressure washing and Softwashing techniques to eliminate existing organic growth and inhibit future growth.",
    bullets: ["Pressure washing and Softwashing", "Eliminates moss, algae, and lichen", "Inhibits future organic growth", "Post-clean inspection and photos"],
  },
  {
    id: "gutters",
    icon: "🏗️",
    title: "Gutter Cleaning & Whitening",
    description: "Maintaining your exterior includes cleaning your gutters to ensure proper drainage and prevent damage from stagnant water and organic growth. Our solution not only clears blockages but also removes black stripes, known as tiger stripes, enhancing your exterior's curb appeal.",
    bullets: ["Clears all blockages", "Removes tiger stripe staining", "Prevents stagnant water damage", "Improves curb appeal"],
  },
  {
    id: "driveway",
    icon: "🛣️",
    title: "Patio, Driveway & Paving Cleaning",
    description: "Cleaning the flat surfaces around your property is essential for preventing micro flooding, slip hazards, and maintaining surface health. Our advanced pressure washing and soft washing techniques guarantee thorough removal of dirt and organic growth, ensuring long-lasting cleanliness and safety.",
    bullets: ["Prevents micro flooding and slip hazards", "Removes dirt and organic growth", "Pressure washing and soft washing", "Long-lasting cleanliness"],
  },
  {
    id: "deck",
    icon: "🌿",
    title: "Deck & Wood Cleaning",
    description: "Revitalize your wooden fencing, decks, and other surfaces with our specialized pressure and soft washing solutions. Our techniques breathe new life into these areas, restoring their pristine appearance and making them look brand new once more.",
    bullets: ["Specialised for wood surfaces", "Revitalises decks and fencing", "Pressure and soft washing", "Restores pristine appearance"],
  },
];

export default function ServicesPage() {
  return (
    <div style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="page-hero" style={{ background: "var(--navy)", padding: "64px 0 80px", position: "relative", overflow: "hidden" }}>
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
      <div className="ui-container pg-body" style={{ padding: "60px 24px" }}>
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

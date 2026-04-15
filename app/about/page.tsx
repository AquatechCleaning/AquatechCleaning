import Link from "next/link";

const highlights = [
  { icon: "🏆", title: "10+ Years Experience", body: "A decade of exterior cleaning across the Western Cape. We've seen every surface type." },
  { icon: "🛡️", title: "Fully Insured", body: "Our crews carry full public liability insurance and height-work safety gear on every job." },
  { icon: "⚙️", title: "Modern Equipment", body: "Rotary surface cleaners, soft-wash rigs, and water-capture systems for sensitive sites." },
  { icon: "📸", title: "Detailed Reporting", body: "After every job you receive photos, recommendations, and a post-clean inspection report." },
];

export default function AboutPage() {
  return (
    <div style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <div className="page-hero" style={{ background: "var(--navy)", padding: "64px 0 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div className="ui-container" style={{ position: "relative" }}>
          <p className="ui-kicker reveal-up" style={{ color: "var(--accent)" }}>Our Story</p>
          <h1 className="ui-title reveal-up reveal-up-d1" style={{ color: "#fff", marginTop: "8px", marginBottom: "12px" }}>
            Aqua-tech precision with hands-on service.
          </h1>
          <p className="ui-subtitle reveal-up reveal-up-d2" style={{ color: "rgba(255,255,255,0.65)", maxWidth: "520px" }}>
            Aquatech Cleaning is a Cape Town crew focused on quality, safety, and respect for your property.
          </p>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40px", background: "var(--bg)", clipPath: "ellipse(60% 100% at 50% 100%)" }} />
      </div>

      <div className="ui-container pg-body" style={{ padding: "60px 24px" }}>
        {/* Story */}
        <div className="ui-card reveal-up" style={{ padding: "40px", marginBottom: "24px" }}>
          <div className="rsp-grid-2" style={{ gap: "40px", alignItems: "center" }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 800, color: "var(--navy)", marginBottom: "16px" }}>
                How we started
              </h2>
              <p style={{ fontSize: "15px", color: "#334155", lineHeight: 1.8, marginBottom: "16px" }}>
                We are Cape Town&apos;s #1 pressure washing service, trusted by homeowners and businesses alike
                with over 500+ properties professionally cleaned. Formerly known as Aqua Blast Power Wash and
                Clean Tech Exterior Cleaning, we&apos;ve built our reputation on speed, precision, and quality.
              </p>
              <p style={{ fontSize: "15px", color: "#334155", lineHeight: 1.8, marginBottom: "16px" }}>
                Using high-performance equipment and expert techniques, we tackle dirt, grime, and stains on all
                exterior surfaces. Every clean is finished with biocide treatment to ensure long-lasting results
                and prevent regrowth of mold, moss, algae, and mildew.
              </p>
              <p style={{ fontSize: "15px", color: "#334155", lineHeight: 1.8 }}>
                When you choose us, you&apos;re choosing a team committed to fast, reliable service without ever
                compromising on quality.
              </p>
            </div>
            <div
              style={{
                background: "linear-gradient(135deg, #EFF6FF 0%, #FEF9C3 100%)",
                borderRadius: "16px",
                padding: "32px",
                textAlign: "center",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ fontFamily: "var(--font-display)", fontSize: "48px", fontWeight: 800, color: "var(--navy)" }}>500+</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600 }}>Properties professionally cleaned</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "36px", fontWeight: 800, color: "var(--primary)", marginTop: "16px" }}>#1</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600 }}>Pressure washing service in Cape Town</div>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 800, color: "var(--navy)", marginBottom: "20px" }} className="reveal-up">
          Why clients stay with us
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "40px" }}>
          {highlights.map((h, i) => (
            <div
              key={h.title}
              className={`ui-card reveal-up reveal-up-d${i + 1}`}
              style={{ padding: "24px" }}
            >
              <div style={{ fontSize: "28px", marginBottom: "12px" }}>{h.icon}</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--navy)", marginBottom: "8px" }}>{h.title}</h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7 }}>{h.body}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="ui-card reveal-up" style={{ padding: "32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px", border: "2px solid var(--accent)" }}>
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 800, color: "var(--navy)", marginBottom: "6px" }}>Ready to work with us?</h3>
            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Get an instant quote or reach out to our team directly.</p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <Link href="/quote" className="ui-btn ui-btn-primary">Get a Quote</Link>
            <Link href="/contact" className="ui-btn ui-btn-ghost">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

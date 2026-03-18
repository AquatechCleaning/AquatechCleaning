import Link from "next/link";

export function MiniMap() {
  return (
    <section style={{ padding: "80px 0", background: "var(--navy)" }}>
      <div className="ui-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            alignItems: "center",
          }}
        >
          <div className="reveal-up">
            <p className="ui-kicker" style={{ color: "var(--accent)" }}>
              Service Area
            </p>
            <h2
              className="ui-title"
              style={{ color: "#fff", marginTop: "8px", marginBottom: "16px" }}
            >
              Serving Cape Town and surrounds
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "15px",
                lineHeight: 1.8,
                marginBottom: "28px",
              }}
            >
              Northern and Southern suburbs, Atlantic Seaboard, Stellenbosch,
              Paarl, and the Winelands. We frequently travel for larger
              commercial work outside these areas.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <Link href="/contact" className="ui-btn ui-btn-primary">
                Contact Us
              </Link>
              <Link href="/quote" className="ui-btn ui-btn-outline-light">
                Get a Quote
              </Link>
            </div>
          </div>

          <div
            className="reveal-up reveal-up-d2 float-soft"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              padding: "24px",
              aspectRatio: "4/3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.35)",
              fontSize: "13px",
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            <div>
              <p style={{ fontSize: "32px", marginBottom: "12px" }}>🗺️</p>
              <p>Google Maps embed</p>
              <p style={{ fontSize: "11px", marginTop: "6px", color: "rgba(255,255,255,0.25)" }}>
                Add a Maps embed via your Google Maps API key
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

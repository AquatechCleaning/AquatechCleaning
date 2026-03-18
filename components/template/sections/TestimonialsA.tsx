export function TestimonialsA({
  items,
}: {
  items: Array<{ name: string; role?: string; quote: string }>;
}) {
  return (
    <section style={{ background: "var(--bg)", padding: "80px 0" }}>
      <div className="ui-container">
        <div className="ui-section-header reveal-up" style={{ textAlign: "center" }}>
          <p className="ui-kicker">Testimonials</p>
          <h2 className="ui-title" style={{ marginTop: "8px" }}>What People Are Saying</h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {items.map((item, i) => (
            <div
              key={item.name}
              className={`ui-card reveal-up reveal-up-d${Math.min(i + 1, 4)}`}
              style={{ padding: "24px", position: "relative", overflow: "hidden" }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-16px",
                  right: "-8px",
                  fontSize: "80px",
                  color: "rgba(240,169,53,0.07)",
                  fontFamily: "serif",
                  lineHeight: 1,
                  pointerEvents: "none",
                }}
              >
                &ldquo;
              </div>

              <div style={{ display: "flex", gap: "2px", marginBottom: "12px" }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} style={{ color: "var(--accent)", fontSize: "13px" }}>★</span>
                ))}
              </div>

              <p
                style={{
                  fontSize: "14px",
                  color: "#334155",
                  lineHeight: 1.75,
                  marginBottom: "20px",
                  position: "relative",
                }}
              >
                {item.quote}
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "var(--primary)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {item.name
                    .split(" ")
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--navy)" }}>
                    {item.name}
                  </p>
                  {item.role && (
                    <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{item.role}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

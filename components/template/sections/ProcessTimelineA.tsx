export function ProcessTimelineA({
  steps,
}: {
  steps: Array<{ title: string; text: string }>;
}) {
  return (
    <section style={{ background: "#fff", padding: "80px 0" }}>
      <div className="ui-container">
        <div className="ui-section-header reveal-up" style={{ textAlign: "center" }}>
          <p className="ui-kicker">Process</p>
          <h2 className="ui-title" style={{ marginTop: "8px" }}>How It Works</h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "32px",
            position: "relative",
          }}
        >
          {steps.map((step, i) => (
            <div
              key={step.title}
              className={`reveal-up reveal-up-d${Math.min(i + 1, 4)}`}
              style={{ textAlign: "center" }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: "var(--navy)",
                  color: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontSize: "16px",
                  fontWeight: 800,
                  margin: "0 auto 16px",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--navy)",
                  marginBottom: "8px",
                }}
              >
                {step.title}
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7 }}>
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

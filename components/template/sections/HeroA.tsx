import Link from "next/link";

export function HeroA({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section
      style={{
        background: "var(--navy)",
        minHeight: "520px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        padding: "80px 0 120px",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 70% 50%, rgba(5,81,120,0.5) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div className="ui-container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "580px" }}>
          <div
            className="reveal-up"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(240,169,53,0.15)",
              border: "1px solid rgba(240,169,53,0.3)",
              borderRadius: "100px",
              padding: "5px 16px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "24px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--accent)",
                display: "inline-block",
              }}
            />
            Aquatech Cleaning
          </div>

          <h1
            className="ui-title reveal-up reveal-up-d1"
            style={{
              color: "#fff",
              fontSize: "clamp(36px, 5vw, 58px)",
              marginBottom: "20px",
            }}
          >
            {title}
          </h1>

          <p
            className="reveal-up reveal-up-d2"
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.75,
              marginBottom: "36px",
              maxWidth: "460px",
            }}
          >
            {subtitle}
          </p>

          <div className="reveal-up reveal-up-d3" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/services" className="ui-btn ui-btn-primary" style={{ padding: "14px 28px", fontSize: "15px" }}>
              Discover More
            </Link>
            <Link href="/quote" className="ui-btn ui-btn-outline-light" style={{ padding: "14px 28px", fontSize: "15px" }}>
              Create Quote
            </Link>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40px",
          background: "#fff",
          clipPath: "ellipse(60% 100% at 50% 100%)",
        }}
      />
    </section>
  );
}

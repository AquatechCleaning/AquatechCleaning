import Link from "next/link";

export function CTA_A({ title, body }: { title: string; body: string }) {
  return (
    <section
      style={{
        background: "var(--navy)",
        padding: "64px 0",
        position: "relative",
        overflow: "hidden",
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
      <div className="ui-container" style={{ position: "relative", textAlign: "center" }}>
        <p className="ui-kicker" style={{ color: "var(--accent)", marginBottom: "10px" }}>
          Ready to get started?
        </p>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(24px, 3vw, 36px)",
            fontWeight: 800,
            color: "#fff",
            marginBottom: "14px",
            maxWidth: "600px",
            marginInline: "auto",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.65)",
            fontSize: "15px",
            maxWidth: "480px",
            marginInline: "auto",
            marginBottom: "28px",
            lineHeight: 1.7,
          }}
        >
          {body}
        </p>
        <Link href="/quote" className="ui-btn ui-btn-primary" style={{ padding: "14px 32px", fontSize: "15px" }}>
          Create Quote →
        </Link>
      </div>
    </section>
  );
}

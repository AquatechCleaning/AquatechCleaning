import Link from "next/link";

export function GalleryHero() {
  return (
    <div
      style={{
        background: "var(--navy)",
        padding: "64px 0 80px",
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
      <div className="ui-container" style={{ position: "relative" }}>
        <p className="ui-kicker reveal-up" style={{ color: "var(--accent)" }}>
          Our Portfolio
        </p>
        <h1
          className="ui-title reveal-up reveal-up-d1"
          style={{ color: "#fff", marginTop: "8px", marginBottom: "12px" }}
        >
          Before &amp; After Gallery
        </h1>
        <p
          className="ui-subtitle reveal-up reveal-up-d2"
          style={{ color: "rgba(255,255,255,0.65)", maxWidth: "480px", marginBottom: "24px" }}
        >
          Real results from real properties across Cape Town and the Western Cape.
        </p>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/quote" className="ui-btn ui-btn-primary">
            Get a Quote →
          </Link>
          <Link href="/contact" className="ui-btn ui-btn-outline-light">
            Contact Us
          </Link>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40px",
          background: "var(--bg)",
          clipPath: "ellipse(60% 100% at 50% 100%)",
        }}
      />
    </div>
  );
}

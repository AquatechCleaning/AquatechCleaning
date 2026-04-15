import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Aquatech Cleaning",
};

export default function NotFound() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "70vh", display: "flex", alignItems: "center" }}>
      <div className="ui-container" style={{ padding: "80px 24px", textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "80px",
            height: "80px",
            borderRadius: "24px",
            background: "rgba(240,169,53,0.12)",
            fontSize: "36px",
            marginBottom: "24px",
          }}
        >
          🔍
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 800,
            color: "var(--navy)",
            marginBottom: "12px",
            lineHeight: 1.1,
          }}
        >
          Page not found
        </h1>

        <p
          style={{
            fontSize: "16px",
            color: "var(--text-muted)",
            maxWidth: "420px",
            margin: "0 auto 36px",
            lineHeight: 1.7,
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="ui-btn ui-btn-primary" style={{ padding: "13px 28px" }}>
            Back to Home
          </Link>
          <Link href="/quote" className="ui-btn ui-btn-secondary" style={{ padding: "13px 28px" }}>
            Get a Quote
          </Link>
          <Link href="/contact" className="ui-btn ui-btn-ghost" style={{ padding: "13px 28px" }}>
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

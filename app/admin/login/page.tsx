"use client";

import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--navy)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid texture */}
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
          position: "relative",
          width: "100%",
          maxWidth: "400px",
          background: "#fff",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "var(--shadow-xl)",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            fontWeight: 800,
            color: "var(--navy)",
            marginBottom: "28px",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "var(--accent)",
              display: "inline-block",
            }}
          />
          Aquatech Admin
        </div>

        <div
          style={{
            padding: "16px",
            background: "#FEF9C3",
            border: "1px solid #FDE68A",
            borderRadius: "10px",
            marginBottom: "24px",
            fontSize: "13px",
            color: "#92400e",
            lineHeight: 1.6,
          }}
        >
          Authentication is temporarily disabled. You can access the admin directly.
        </div>

        <Link href="/admin/dashboard" className="ui-btn ui-btn-secondary" style={{ width: "100%", padding: "13px" }}>
          Go to Admin Dashboard →
        </Link>

        <Link
          href="/"
          style={{
            display: "block",
            marginTop: "16px",
            fontSize: "13px",
            color: "var(--text-muted)",
            textDecoration: "none",
          }}
        >
          ← Back to site
        </Link>
      </div>
    </div>
  );
}

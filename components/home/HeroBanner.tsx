"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.272h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

export function HeroBanner() {
  const ref = useRef<HTMLElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = rect.top + rect.height / 2;
      const dist = Math.abs(center - vh / 2);
      const max = vh / 2 + rect.height / 2;
      const p = Math.max(0, 1 - dist / max);
      setScale(1 + 0.35 * p);
    };
    const handler = () => { if (raf) return; raf = requestAnimationFrame(() => { update(); raf = 0; }); };
    update();
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    return () => { if (raf) cancelAnimationFrame(raf); window.removeEventListener("scroll", handler); window.removeEventListener("resize", handler); };
  }, []);

  return (
    <section
      ref={ref}
      className="hero-section"
      style={{
        background: "var(--navy)",
        minHeight: "560px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        padding: "80px 0 120px",
      }}
    >
      {/* Grid texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 70% 50%, rgba(5,81,120,0.55) 0%, transparent 65%), radial-gradient(ellipse at 15% 80%, rgba(240,169,53,0.07) 0%, transparent 40%)",
          pointerEvents: "none",
        }}
      />
      {/* Logo image parallax */}
      <div
        className="hero-logo-bg"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/Logo.png)",
          backgroundSize: "45% auto",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "calc(50% + 260px) center",
          transform: `scale(${scale})`,
          transformOrigin: "center",
          transition: "transform 100ms linear",
          opacity: 0.15,
          pointerEvents: "none",
        }}
      />

      <div className="ui-container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "580px" }}>
          {/* Kicker */}
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
              maxWidth: "100%",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", flexShrink: 0, display: "inline-block" }} />
            Cape Town&apos;s No.1 Exterior Cleaning
          </div>

          {/* Title */}
          <h1
            className="reveal-up reveal-up-d1"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.05,
              marginBottom: "20px",
            }}
          >
            Exterior Cleaning.{" "}
            <em style={{ color: "var(--accent)", fontStyle: "normal" }}>Done right.</em>
          </h1>

          {/* Subtitle */}
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
            Roofs, driveways, patios, windows and commercial properties. Pressure washing and soft washing with precision equipment across Cape Town and the Western Cape.
          </p>

          {/* Actions */}
          <div className="reveal-up reveal-up-d3 hero-actions" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/quote" className="ui-btn ui-btn-primary" style={{ padding: "14px 28px", fontSize: "15px" }}>
              Get an Instant Quote →
            </Link>
            <Link href="/gallery" className="ui-btn ui-btn-outline-light" style={{ padding: "14px 28px", fontSize: "15px" }}>
              View Our Work
            </Link>
          </div>

          {/* Trust indicators */}
          <div
            className="reveal-up reveal-up-d4"
            style={{
              marginTop: "40px",
              display: "flex",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            {["✓ Fully insured", "✓ Free site inspection", "✓ Instant online quotes"].map((t) => (
              <span key={t} style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>
                {t}
              </span>
            ))}
          </div>

          {/* Social links */}
          <div
            className="reveal-up reveal-up-d4"
            style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "12px" }}
          >
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Follow us
            </span>
            {siteConfig.socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                  transition: "background 200ms, color 200ms",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(240,169,53,0.2)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.7)";
                }}
              >
                {s.name === "Facebook" ? <FacebookIcon /> : <InstagramIcon />}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "40px",
          background: "#fff",
          clipPath: "ellipse(60% 100% at 50% 100%)",
        }}
      />
    </section>
  );
}

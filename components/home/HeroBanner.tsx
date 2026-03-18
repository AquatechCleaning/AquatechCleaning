"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
            Cape Town&apos;s Premium Exterior Cleaners
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
            Surface-perfect.{" "}
            <em style={{ color: "var(--accent)", fontStyle: "normal" }}>Every time.</em>
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
            Roofs, driveways, facades &amp; commercial properties — cleaned with precision equipment and fully insured crews across the Western Cape.
          </p>

          {/* Actions */}
          <div className="reveal-up reveal-up-d3" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
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

"use client";

import { useEffect, useRef, useState } from "react";

type Stat = { label: string; value: number; suffix?: string; decimals?: number };

export function StatsBlock({ stats }: { stats: Stat[] }) {
  const [visible, setVisible] = useState(false);
  const [vals, setVals] = useState(stats.map(() => 0));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const start = performance.now();
    const dur = 1400;
    const raf = requestAnimationFrame(function tick(now) {
      const p = Math.min(1, (now - start) / dur);
      const ease = 1 - Math.pow(1 - p, 3);
      setVals(stats.map((s) => {
        const raw = s.value * ease;
        return s.decimals ? Math.round(raw * 10 ** s.decimals) / 10 ** s.decimals : Math.round(raw);
      }));
      if (p < 1) requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [visible, stats]);

  return (
    <div
      ref={ref}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
        gap: "1px",
        background: "var(--border)",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          style={{
            background: "#fff",
            padding: "24px 20px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 3vw, 36px)",
              fontWeight: 800,
              color: "var(--navy)",
              lineHeight: 1,
              marginBottom: "6px",
            }}
          >
            {visible
              ? s.decimals
                ? vals[i].toFixed(s.decimals)
                : vals[i].toLocaleString()
              : "0"}
            <span style={{ color: "var(--accent)" }}>{s.suffix ?? ""}</span>
          </p>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}

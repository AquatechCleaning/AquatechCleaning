"use client";

import { useState } from "react";

export function MissionBeforeAfter() {
  const [yPercent, setYPercent] = useState(50);

  const update = (clientY: number, rect: DOMRect) => {
    const y = ((clientY - rect.top) / rect.height) * 100;
    setYPercent(Math.max(0, Math.min(100, y)));
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: "14px",
        overflow: "hidden",
        cursor: "ns-resize",
        userSelect: "none",
      }}
      onMouseMove={(e) => update(e.clientY, e.currentTarget.getBoundingClientRect())}
      onTouchMove={(e) => {
        const t = e.touches[0];
        if (t) update(t.clientY, e.currentTarget.getBoundingClientRect());
      }}
    >
      <img src="/After.jpeg" alt="After cleaning" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <img
        src="/Before.jpeg"
        alt="Before cleaning"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          clipPath: `inset(0 0 ${100 - yPercent}% 0)`,
        }}
      />
      {/* Divider line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${yPercent}%`,
          height: "2px",
          background: "var(--accent)",
          boxShadow: "0 0 0 1px rgba(2,32,61,0.25)",
          pointerEvents: "none",
        }}
      />
      {/* Labels */}
      <div style={{ position: "absolute", top: "10px", left: "10px", background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "100px" }}>
        Before
      </div>
      <div style={{ position: "absolute", bottom: "10px", right: "10px", background: "var(--accent)", color: "var(--navy)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "100px" }}>
        After
      </div>
    </div>
  );
}

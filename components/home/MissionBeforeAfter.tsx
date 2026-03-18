"use client";

import { useState } from "react";

export function MissionBeforeAfter() {
  const [yPercent, setYPercent] = useState(50);

  const updateFromEvent = (clientY: number, rect: DOMRect) => {
    const y = ((clientY - rect.top) / rect.height) * 100;
    const clamped = Math.max(0, Math.min(100, y));
    setYPercent(clamped);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: "20px",
        border: "3.75px solid #000000",
        overflow: "hidden",
        cursor: "pointer",
      }}
      onMouseMove={(e) => updateFromEvent(e.clientY, e.currentTarget.getBoundingClientRect())}
      onTouchMove={(e) => {
        const touch = e.touches[0];
        if (!touch) return;
        updateFromEvent(touch.clientY, e.currentTarget.getBoundingClientRect());
      }}
    >
      <img
        src="/After.jpeg"
        alt="After cleaning"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

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

      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${yPercent}%`,
          height: "2px",
          background: "#f0a935",
          boxShadow: "0 0 0 1px rgba(2,32,61,0.35)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

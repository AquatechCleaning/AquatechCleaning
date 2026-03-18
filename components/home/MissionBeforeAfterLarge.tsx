"use client";

import { useState } from "react";

export function MissionBeforeAfterLarge() {
  const [xPx, setXPx] = useState(0);
  const [frameWidth, setFrameWidth] = useState(0);

  const update = (raw: number, width: number) => {
    const edge = 6;
    const clamped = Math.max(0, Math.min(width, raw));
    const snapped = clamped <= edge ? 0 : clamped >= width - edge ? width : clamped;
    setFrameWidth(width);
    setXPx(snapped);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        cursor: "ew-resize",
        userSelect: "none",
      }}
      onMouseMove={(e) => update(e.nativeEvent.offsetX, e.currentTarget.clientWidth)}
      onMouseEnter={(e) => update(e.nativeEvent.offsetX, e.currentTarget.clientWidth)}
      onTouchMove={(e) => {
        const t = e.touches[0];
        if (!t) return;
        const rect = e.currentTarget.getBoundingClientRect();
        update(t.clientX - rect.left, e.currentTarget.clientWidth);
      }}
    >
      {/* After (base layer) */}
      <img
        src="/After2.Jpeg"
        alt="After cleaning"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Before (clipped layer) */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, bottom: 0,
          width: frameWidth > 0 ? `${xPx}px` : "50%",
          overflow: "hidden",
          transition: "none",
        }}
      >
        <img
          src="/Before2.jpeg"
          alt="Before cleaning"
          style={{ position: "absolute", inset: 0, width: frameWidth > 0 ? `${frameWidth}px` : "200%", height: "100%", objectFit: "cover", maxWidth: "none" }}
        />
      </div>

      {/* Divider */}
      <div
        style={{
          position: "absolute",
          top: 0, bottom: 0,
          left: frameWidth > 0 ? `${xPx}px` : "50%",
          width: "2px",
          background: "var(--accent)",
          boxShadow: "0 0 0 1px rgba(2,32,61,0.25)",
          pointerEvents: "none",
          transform: "translateX(-1px)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            color: "var(--navy)",
            fontWeight: 800,
            boxShadow: "0 2px 8px rgba(2,32,61,0.3)",
          }}
        >
          ↔
        </div>
      </div>

      {/* Labels */}
      <div style={{ position: "absolute", top: "10px", left: "10px", background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "100px" }}>
        Before
      </div>
      <div style={{ position: "absolute", top: "10px", right: "10px", background: "var(--accent)", color: "var(--navy)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "100px" }}>
        After
      </div>
    </div>
  );
}

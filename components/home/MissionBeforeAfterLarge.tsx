"use client";

import { useState } from "react";

export function MissionBeforeAfterLarge() {
  const [xPx, setXPx] = useState(0);
  const [frameWidth, setFrameWidth] = useState(0);

  const updateFromPosition = (raw: number, width: number) => {
    const edgeSnap = 6;
    const clamped = Math.max(0, Math.min(width, raw));
    const snapped = clamped <= edgeSnap ? 0 : clamped >= width - edgeSnap ? width : clamped;
    setFrameWidth(width);
    setXPx(snapped);
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
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          cursor: "pointer",
        }}
        onMouseMove={(e) => updateFromPosition(e.nativeEvent.offsetX, e.currentTarget.clientWidth)}
        onMouseEnter={(e) => updateFromPosition(e.nativeEvent.offsetX, e.currentTarget.clientWidth)}
        onTouchMove={(e) => {
          const touch = e.touches[0];
          if (!touch) return;
          const rect = e.currentTarget.getBoundingClientRect();
          updateFromPosition(touch.clientX - rect.left, e.currentTarget.clientWidth);
        }}
      >
        <img
          src="/After2.Jpeg"
          alt="After cleaning"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: frameWidth > 0 ? `${xPx}px` : "50%",
            overflow: "hidden",
          }}
        >
          <img
            src="/Before2.jpeg"
            alt="Before cleaning"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: frameWidth > 0 ? `${Math.max(0, xPx)}px` : "50%",
            width: "2px",
            background: "#f0a935",
            boxShadow: "0 0 0 1px rgba(2,32,61,0.35)",
            pointerEvents: "none",
            transform: "translateX(-1px)",
          }}
        />
      </div>
    </div>
  );
}

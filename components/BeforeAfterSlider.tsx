"use client";

import { TouchEvent, useState } from "react";

type BeforeAfterSliderProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  height?: string | number;
  borderRadius?: string | number;
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "Before",
  afterAlt = "After",
  height = 240,
  borderRadius = 14,
}: BeforeAfterSliderProps) {
  const [xPx, setXPx] = useState(0);
  const [frameWidth, setFrameWidth] = useState(0);

  const update = (raw: number, width: number) => {
    const edge = 6;
    const clamped = Math.max(0, Math.min(width, raw));
    const snapped = clamped <= edge ? 0 : clamped >= width - edge ? width : clamped;
    setFrameWidth(width);
    setXPx(snapped);
  };

  const handleTouch = (e: TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;

    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    update(touch.clientX - rect.left, e.currentTarget.clientWidth);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height,
        borderRadius,
        overflow: "hidden",
        cursor: "ew-resize",
        userSelect: "none",
        touchAction: "none",
        overscrollBehavior: "contain",
      }}
      onMouseMove={(e) => update(e.nativeEvent.offsetX, e.currentTarget.clientWidth)}
      onMouseEnter={(e) => update(e.nativeEvent.offsetX, e.currentTarget.clientWidth)}
      onTouchStart={handleTouch}
      onTouchMove={handleTouch}
    >
      <img src={afterSrc} alt={afterAlt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />

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
          src={beforeSrc}
          alt={beforeAlt}
          style={{
            position: "absolute",
            inset: 0,
            width: frameWidth > 0 ? `${frameWidth}px` : "200%",
            height: "100%",
            objectFit: "cover",
            maxWidth: "none",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
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

      <div style={{ position: "absolute", top: "10px", left: "10px", background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "100px" }}>
        Before
      </div>
      <div style={{ position: "absolute", top: "10px", right: "10px", background: "var(--accent)", color: "var(--navy)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "100px" }}>
        After
      </div>
    </div>
  );
}

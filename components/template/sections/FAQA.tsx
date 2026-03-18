"use client";

import { useState } from "react";

export function FAQA({ items }: { items: Array<{ q: string; a: string }> }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section style={{ background: "var(--bg)", padding: "80px 0" }}>
      <div className="ui-container">
        <div className="ui-section-header" style={{ textAlign: "center" }}>
          <p className="ui-kicker">FAQ</p>
          <h2 className="ui-title" style={{ marginTop: "8px" }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div
          style={{
            maxWidth: "680px",
            marginInline: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {items.map((item, i) => (
            <div
              key={item.q}
              className="ui-card"
              style={{ overflow: "hidden" }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%",
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "var(--font-display)",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--navy)",
                }}
              >
                {item.q}
                <span
                  style={{
                    flexShrink: 0,
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: open === i ? "var(--primary)" : "var(--surface-2)",
                    color: open === i ? "#fff" : "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    transition: "all 180ms",
                  }}
                >
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i && (
                <div
                  style={{
                    padding: "0 20px 18px",
                    fontSize: "14px",
                    color: "var(--text-muted)",
                    lineHeight: 1.75,
                    borderTop: "1px solid var(--border)",
                    paddingTop: "14px",
                  }}
                >
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

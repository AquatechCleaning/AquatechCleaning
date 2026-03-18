"use client";

import { useState } from "react";

type Testimonial = { _id: string; name: string; location?: string; rating: number; comment: string };

function Stars({ n }: { n: number }) {
  return (
    <div style={{ display: "flex", gap: "2px", marginBottom: "12px" }}>
      {[1,2,3,4,5].map((i) => (
        <span key={i} style={{ color: i <= n ? "var(--accent)" : "var(--border-2)", fontSize: "14px" }}>★</span>
      ))}
    </div>
  );
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export function TestimonialsSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const [idx, setIdx] = useState(0);

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="ui-card" style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
        Add testimonials in the admin panel to showcase social proof here.
      </div>
    );
  }

  // Show up to 3 at a time
  const perPage = 3;
  const pages = Math.ceil(testimonials.length / perPage);
  const page = Math.floor(idx / perPage);
  const visible = testimonials.slice(page * perPage, page * perPage + perPage);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
        {visible.map((t) => (
          <div key={t._id} className="ui-card" style={{ padding: "24px", position: "relative", overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                top: "-20px",
                right: "-10px",
                fontSize: "80px",
                color: "rgba(240,169,53,0.08)",
                fontFamily: "serif",
                lineHeight: 1,
                pointerEvents: "none",
              }}
            >
              &ldquo;
            </div>
            <Stars n={t.rating} />
            <p style={{ fontSize: "14px", color: "#334155", lineHeight: 1.75, marginBottom: "20px", position: "relative" }}>
              {t.comment}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px", height: "36px",
                  borderRadius: "50%",
                  background: "var(--primary)",
                  color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "11px", fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {initials(t.name)}
              </div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--navy)" }}>{t.name}</p>
                {t.location && <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{t.location}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {pages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i * perPage)}
              style={{
                width: i === page ? "24px" : "8px",
                height: "8px",
                borderRadius: "100px",
                background: i === page ? "var(--primary)" : "var(--border-2)",
                border: "none",
                cursor: "pointer",
                transition: "all 250ms ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

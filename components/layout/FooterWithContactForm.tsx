"use client";

import { useState, FormEvent } from "react";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";

export function FooterWithContactForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Newsletter stub — wire up to your email provider
    setSubmitted(true);
    setEmail("");
  };

  return (
    <>
      {/* Newsletter strip above footer */}
      <div
        style={{
          background: "var(--primary)",
          padding: "36px 0",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="ui-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "17px",
                fontWeight: 800,
                color: "#fff",
                marginBottom: "4px",
              }}
            >
              Don&apos;t miss cleaning tips &amp; seasonal deals
            </p>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>
              Subscribe for free advice on keeping your property in top condition.
            </p>
          </div>

          {submitted ? (
            <div
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: "10px",
                padding: "12px 20px",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              ✓ You&apos;re subscribed!
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                gap: "0",
                borderRadius: "10px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.2)",
                flexShrink: 0,
              }}
            >
              <input
                type="email"
                required
                placeholder="Your email address…"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: "11px 16px",
                  fontSize: "13px",
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "#fff",
                  outline: "none",
                  minWidth: "220px",
                  fontFamily: "var(--font-body)",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "11px 18px",
                  background: "var(--accent)",
                  color: "var(--navy)",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  fontFamily: "var(--font-display)",
                  whiteSpace: "nowrap",
                }}
              >
                Subscribe →
              </button>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

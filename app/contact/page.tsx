"use client";

import { FormEvent, useState } from "react";
import { siteConfig } from "@/config/site";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitToGoogleForm = (f: typeof form) => {
    const data = new URLSearchParams({
      "entry.610817925": f.name,
      "entry.1601371558": f.phone,
      "entry.506579315": f.address,
      "entry.796986695": "Contact Form Enquiry",
      "entry.604884726": f.message,
    });
    fetch(
      "https://docs.google.com/forms/d/e/1FAIpQLSfeT2Zq-L_9u_Ca-lSss8a8jIcx19K2crdj5pOaktmC5kzGmw/formResponse",
      { method: "POST", mode: "no-cors", body: data }
    ).catch(() => {});
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("server");
      submitToGoogleForm(form);
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", address: "", message: "" });
    } catch {
      // Google Form still receives data even if our API is down
      submitToGoogleForm(form);
      setError("Our server had an issue, but your message was recorded. We'll be in touch shortly.");
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const details = [
    { icon: "📞", label: "Phone", value: siteConfig.phoneDisplay, href: siteConfig.phoneHref },
    { icon: "✉️", label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
    { icon: "📍", label: "Location", value: "Cape Town, Western Cape, South Africa", href: null },
    { icon: "⏰", label: "Hours", value: siteConfig.hoursText, href: null },
  ];

  return (
    <div style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="page-hero" style={{ background: "var(--navy)", padding: "64px 0 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div className="ui-container" style={{ position: "relative" }}>
          <p className="ui-kicker reveal-up" style={{ color: "var(--accent)" }}>Get In Touch</p>
          <h1 className="ui-title reveal-up reveal-up-d1" style={{ color: "#fff", marginTop: "8px", marginBottom: "12px" }}>Let&apos;s plan your clean.</h1>
          <p className="ui-subtitle reveal-up reveal-up-d2" style={{ color: "rgba(255,255,255,0.65)", maxWidth: "480px" }}>
            Share your property details and we&apos;ll confirm a plan within one business day.
          </p>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40px", background: "var(--bg)", clipPath: "ellipse(60% 100% at 50% 100%)" }} />
      </div>

      <div className="ui-container pg-body" style={{ padding: "60px 24px" }}>
        <div className="rsp-grid-contact" style={{ gap: "24px", alignItems: "start" }}>
          {/* Form */}
          <div className="ui-card reveal-up" style={{ padding: "36px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 800, color: "var(--navy)", marginBottom: "24px" }}>
              Send us a message
            </h2>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>{error ? "⚠️" : "✅"}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color: "var(--navy)", marginBottom: "8px" }}>
                  {error ? "Message recorded" : "Message sent!"}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.7 }}>
                  {error || "We'll get back to you within one business day."}
                </p>
                {error && (
                  <a href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer" className="ui-btn ui-btn-primary" style={{ marginTop: "20px" }}>
                    Message us on WhatsApp instead
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="rsp-grid-form-2" style={{ gap: "16px", marginBottom: "16px" }}>
                  <div className="ui-form-group" style={{ margin: 0 }}>
                    <label className="ui-label">Name</label>
                    <input className="ui-input" placeholder="John Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="ui-form-group" style={{ margin: 0 }}>
                    <label className="ui-label">Email</label>
                    <input className="ui-input" type="email" placeholder="john@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div className="ui-form-group" style={{ margin: 0 }}>
                    <label className="ui-label">Phone</label>
                    <input className="ui-input" placeholder="+27 82 000 0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="ui-form-group" style={{ margin: 0 }}>
                    <label className="ui-label">Address / Suburb</label>
                    <input className="ui-input" placeholder="Constantia, Cape Town" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  </div>
                </div>
                <div className="ui-form-group">
                  <label className="ui-label">Message</label>
                  <textarea className="ui-input" rows={5} placeholder="Tell us about your property and what needs cleaning…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required style={{ resize: "vertical" }} />
                </div>
                <button type="submit" className="ui-btn ui-btn-primary" style={{ width: "100%", padding: "14px" }} disabled={loading}>
                  {loading ? "Sending…" : "Send Message →"}
                </button>
              </form>
            )}
          </div>

          {/* Contact details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }} className="reveal-up reveal-up-d2">
            {details.map((d) => (
              <div key={d.label} className="ui-card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                  {d.icon}
                </div>
                <div>
                  <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "4px" }}>{d.label}</p>
                  {d.href ? (
                    <a href={d.href} style={{ fontSize: "14px", fontWeight: 600, color: "var(--primary)", textDecoration: "none" }}>{d.value}</a>
                  ) : (
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--navy)" }}>{d.value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="ui-card" style={{ padding: "24px", background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "#15803d" }}>
                  Prefer WhatsApp?
                </h3>
              </div>
              <p style={{ fontSize: "13px", color: "#166534", marginBottom: "16px", lineHeight: 1.7 }}>
                Chat directly with our team for fast answers and booking.
              </p>
              <a href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer" className="ui-btn" style={{ width: "100%", textAlign: "center", background: "#25D366", color: "#fff" }}>
                Open WhatsApp →
              </a>
            </div>

            <div className="ui-card" style={{ padding: "24px", background: "var(--navy)", border: "none" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>
                Want an instant price?
              </h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", marginBottom: "16px", lineHeight: 1.7 }}>
                Use our map-based quoting tool to measure your surfaces and get an estimate in seconds.
              </p>
              <a href="/quote" className="ui-btn ui-btn-primary" style={{ width: "100%", textAlign: "center" }}>
                Try the Quote Tool →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

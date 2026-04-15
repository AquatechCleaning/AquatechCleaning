"use client";

import { FormEvent, useState } from "react";
import { siteConfig } from "@/config/site";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    submitToGoogleForm(form);
    setSubmitted(true);
    setLoading(false);
    setForm({ name: "", email: "", phone: "", address: "", message: "" });
  };

  const details = [
    { icon: "📞", label: "Phone", value: siteConfig.phoneDisplay, href: siteConfig.phoneHref },
    { icon: "✉️", label: "Email", value: "aston@aquatechcleaning.co.za", href: "mailto:aston@aquatechcleaning.co.za" },
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
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color: "var(--navy)", marginBottom: "8px" }}>Message sent!</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>We&apos;ll get back to you within one business day.</p>
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

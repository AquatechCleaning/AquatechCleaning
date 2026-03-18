"use client";

import { useEffect, useState } from "react";

type Testimonial = { _id?: string; name: string; location?: string; rating: number; comment: string; featured?: boolean };

const emptyForm: Testimonial = { name: "", location: "", rating: 5, comment: "", featured: true };

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [form, setForm] = useState<Testimonial>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await fetch("/api/testimonials");
    setItems(await res.json());
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    setSaving(true);
    await fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm(emptyForm);
    await load();
    setSaving(false);
  };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <p className="ui-kicker">Content</p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 800, color: "var(--navy)", marginTop: "6px" }}>Testimonials</h1>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>Curate featured client testimonials for the homepage.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Form */}
        <div className="ui-card" style={{ padding: "24px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--navy)", marginBottom: "18px" }}>Add Testimonial</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="ui-form-group">
              <label className="ui-label">Name</label>
              <input className="ui-input" placeholder="Sarah M." value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="ui-form-group">
              <label className="ui-label">Location</label>
              <input className="ui-input" placeholder="Constantia, Cape Town" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>
          <div className="ui-form-group">
            <label className="ui-label">Rating (1–5)</label>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setForm({ ...form, rating: n })}
                  style={{
                    width: "36px", height: "36px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: form.rating >= n ? "var(--accent)" : "#fff",
                    color: form.rating >= n ? "var(--navy)" : "var(--text-muted)",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  ★
                </button>
              ))}
              <span style={{ fontSize: "13px", color: "var(--text-muted)", marginLeft: "4px" }}>{form.rating}/5</span>
            </div>
          </div>
          <div className="ui-form-group">
            <label className="ui-label">Comment</label>
            <textarea className="ui-input" rows={4} placeholder="What the client said…" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} style={{ resize: "vertical" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <input type="checkbox" id="feat" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }} />
            <label htmlFor="feat" style={{ fontSize: "13px", color: "var(--navy)", fontWeight: 500 }}>Feature on homepage</label>
          </div>
          <button className="ui-btn ui-btn-primary" style={{ width: "100%" }} onClick={submit} disabled={saving || !form.name || !form.comment}>
            {saving ? "Saving…" : "Add Testimonial"}
          </button>
        </div>

        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "600px", overflowY: "auto" }}>
          {items.length === 0 && (
            <div className="ui-card" style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>No testimonials yet.</div>
          )}
          {items.map((t) => (
            <div key={t._id} className="ui-card" style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
                <div>
                  <p style={{ fontWeight: 600, color: "var(--navy)", fontSize: "13px" }}>{t.name}</p>
                  {t.location && <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{t.location}</p>}
                </div>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[1,2,3,4,5].map((n) => (
                    <span key={n} style={{ color: n <= t.rating ? "var(--accent)" : "var(--border-2)", fontSize: "12px" }}>★</span>
                  ))}
                </div>
              </div>
              <p style={{ fontSize: "13px", color: "#334155", lineHeight: 1.65 }}>{t.comment}</p>
              {t.featured && (
                <span style={{ display: "inline-block", marginTop: "8px", fontSize: "10px", fontWeight: 700, color: "var(--primary)", background: "#EFF6FF", padding: "2px 8px", borderRadius: "100px" }}>
                  ⭐ Featured
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

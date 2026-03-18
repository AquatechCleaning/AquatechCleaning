"use client";

import { useEffect, useState } from "react";

type MediaItem = {
  _id?: string;
  title: string;
  imageBeforeUrl: string;
  imageAfterUrl: string;
  serviceType?: string;
  locationLabel?: string;
  featured?: boolean;
};

const emptyForm: MediaItem = { title: "", imageBeforeUrl: "", imageAfterUrl: "", serviceType: "", locationLabel: "", featured: true };

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [form, setForm] = useState<MediaItem>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await fetch("/api/media");
    setItems(await res.json());
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    setSaving(true);
    await fetch("/api/media", {
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
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 800, color: "var(--navy)", marginTop: "6px" }}>
          Before / After Media
        </h1>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>Showcase featured project transformations.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Add form */}
        <div className="ui-card" style={{ padding: "24px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--navy)", marginBottom: "18px" }}>
            Add New Item
          </h2>
          <div className="ui-form-group">
            <label className="ui-label">Title</label>
            <input className="ui-input" placeholder="e.g. Constantia Roof Clean" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="ui-form-group">
            <label className="ui-label">Before Image URL</label>
            <input className="ui-input" placeholder="https://..." value={form.imageBeforeUrl} onChange={(e) => setForm({ ...form, imageBeforeUrl: e.target.value })} />
          </div>
          <div className="ui-form-group">
            <label className="ui-label">After Image URL</label>
            <input className="ui-input" placeholder="https://..." value={form.imageAfterUrl} onChange={(e) => setForm({ ...form, imageAfterUrl: e.target.value })} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="ui-form-group">
              <label className="ui-label">Service Type</label>
              <select className="ui-input" value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value })}>
                <option value="">Select…</option>
                <option value="roof">Roof</option>
                <option value="driveway">Driveway</option>
                <option value="walls">Walls</option>
                <option value="commercial">Commercial</option>
                <option value="windows">Windows</option>
                <option value="solar_panels">Solar Panels</option>
              </select>
            </div>
            <div className="ui-form-group">
              <label className="ui-label">Location Label</label>
              <input className="ui-input" placeholder="e.g. Constantia" value={form.locationLabel} onChange={(e) => setForm({ ...form, locationLabel: e.target.value })} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }}
            />
            <label htmlFor="featured" style={{ fontSize: "13px", color: "var(--navy)", fontWeight: 500 }}>
              Feature on homepage
            </label>
          </div>
          <button className="ui-btn ui-btn-primary" style={{ width: "100%" }} onClick={submit} disabled={saving || !form.title || !form.imageBeforeUrl || !form.imageAfterUrl}>
            {saving ? "Saving…" : "Add Media Item"}
          </button>
        </div>

        {/* Items list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "600px", overflowY: "auto" }}>
          {items.length === 0 && (
            <div className="ui-card" style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
              No media items yet. Add your first before/after pair.
            </div>
          )}
          {items.map((item) => (
            <div key={item._id} className="ui-card" style={{ overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                <img src={item.imageBeforeUrl} alt="Before" style={{ height: "120px", width: "100%", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).style.background = "#f1f5f9"; }} />
                <img src={item.imageAfterUrl}  alt="After"  style={{ height: "120px", width: "100%", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).style.background = "#f1f5f9"; }} />
              </div>
              <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--navy)" }}>{item.title}</p>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {item.serviceType} {item.locationLabel ? `· ${item.locationLabel}` : ""}
                    {item.featured ? " · ⭐ Featured" : ""}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

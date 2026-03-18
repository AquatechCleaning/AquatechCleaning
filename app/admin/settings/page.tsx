"use client";

import { useEffect, useState } from "react";

type Settings = {
  homepageHeroTitle?: string;
  homepageHeroSubtitle?: string;
  homepageHeroImageUrl?: string;
  contactPhone?: string;
  contactEmail?: string;
  companyName?: string;
  companyVatNumber?: string;
  companyRegNumber?: string;
  companyPostalAddress?: string;
  companyPhysicalAddress?: string;
  companySalesRep?: string;
  quoteNumberStart?: number;
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="ui-form-group">
    <label className="ui-label">{label}</label>
    {children}
  </div>
);

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then((d) => setSettings(d)).catch(() => {});
  }, []);

  const set = (k: keyof Settings, v: any) => setSettings((s) => ({ ...s, [k]: v }));

  const save = async () => {
    setSaving(true);
    await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <p className="ui-kicker">Configuration</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 800, color: "var(--navy)", marginTop: "6px" }}>Site Settings</h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>Control hero copy, contact details, and company info.</p>
        </div>
        <button className="ui-btn ui-btn-primary" onClick={save} disabled={saving}>
          {saved ? "✓ Saved!" : saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Homepage */}
        <div className="ui-card" style={{ padding: "24px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--navy)", marginBottom: "18px" }}>🌐 Homepage Hero</h2>
          <Field label="Hero Title">
            <input className="ui-input" value={settings.homepageHeroTitle ?? ""} onChange={(e) => set("homepageHeroTitle", e.target.value)} placeholder="Surface-perfect. Every time." />
          </Field>
          <Field label="Hero Subtitle">
            <textarea className="ui-input" rows={3} value={settings.homepageHeroSubtitle ?? ""} onChange={(e) => set("homepageHeroSubtitle", e.target.value)} placeholder="Subtitle copy…" style={{ resize: "vertical" }} />
          </Field>
          <Field label="Hero Background Image URL">
            <input className="ui-input" value={settings.homepageHeroImageUrl ?? ""} onChange={(e) => set("homepageHeroImageUrl", e.target.value)} placeholder="https://…" />
          </Field>
        </div>

        {/* Contact */}
        <div className="ui-card" style={{ padding: "24px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--navy)", marginBottom: "18px" }}>📞 Contact Details</h2>
          <Field label="Phone">
            <input className="ui-input" value={settings.contactPhone ?? ""} onChange={(e) => set("contactPhone", e.target.value)} placeholder="+27 82 000 0000" />
          </Field>
          <Field label="Email">
            <input className="ui-input" type="email" value={settings.contactEmail ?? ""} onChange={(e) => set("contactEmail", e.target.value)} placeholder="hello@aquatechcleaning.co.za" />
          </Field>
        </div>

        {/* Company */}
        <div className="ui-card" style={{ padding: "24px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--navy)", marginBottom: "18px" }}>🏢 Company Info</h2>
          <Field label="Company Name">
            <input className="ui-input" value={settings.companyName ?? ""} onChange={(e) => set("companyName", e.target.value)} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Field label="VAT Number">
              <input className="ui-input" value={settings.companyVatNumber ?? ""} onChange={(e) => set("companyVatNumber", e.target.value)} />
            </Field>
            <Field label="Reg Number">
              <input className="ui-input" value={settings.companyRegNumber ?? ""} onChange={(e) => set("companyRegNumber", e.target.value)} />
            </Field>
          </div>
          <Field label="Physical Address">
            <textarea className="ui-input" rows={2} value={settings.companyPhysicalAddress ?? ""} onChange={(e) => set("companyPhysicalAddress", e.target.value)} style={{ resize: "vertical" }} />
          </Field>
          <Field label="Postal Address">
            <textarea className="ui-input" rows={2} value={settings.companyPostalAddress ?? ""} onChange={(e) => set("companyPostalAddress", e.target.value)} style={{ resize: "vertical" }} />
          </Field>
        </div>

        {/* Quotes */}
        <div className="ui-card" style={{ padding: "24px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--navy)", marginBottom: "18px" }}>📋 Quote Settings</h2>
          <Field label="Sales Representative">
            <input className="ui-input" value={settings.companySalesRep ?? ""} onChange={(e) => set("companySalesRep", e.target.value)} placeholder="e.g. John Smith" />
          </Field>
          <Field label="Quote Number Start">
            <input className="ui-input" type="number" min="1" value={settings.quoteNumberStart ?? 1} onChange={(e) => set("quoteNumberStart", Number(e.target.value))} />
          </Field>
          <div
            style={{
              marginTop: "8px",
              padding: "14px 16px",
              background: "#FEF9C3",
              border: "1px solid #FDE68A",
              borderRadius: "10px",
              fontSize: "12px",
              color: "#92400e",
              lineHeight: 1.6,
            }}
          >
            ⚠️ Changing the quote number start will affect all new quotes. Existing quote numbers won&apos;t change.
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { formatCurrency } from "@/lib/format";
import { useEffect, useState } from "react";

type PricingSettings = { rates: Record<string, number>; minimumFee: number; vatIncluded: boolean; vatRate: number };

const serviceFields = [
  { key: "roof", label: "Roof", unit: "m²" },
  { key: "gutters", label: "Gutters", unit: "m" },
  { key: "driveway", label: "Driveway", unit: "m²" },
  { key: "tiles", label: "Tiles", unit: "m²" },
  { key: "wall", label: "Walls", unit: "m" },
  { key: "house_wash", label: "House Wash", unit: "m" },
  { key: "miscellaneous", label: "Miscellaneous", unit: "m²" },
  { key: "windows", label: "Windows", unit: "units" },
  { key: "solar_panels", label: "Solar Panels", unit: "units" },
];

const defaultRates = serviceFields.reduce<Record<string, number>>((acc, f) => { acc[f.key] = 0; return acc; }, {});

export default function PricingPage() {
  const [pricing, setPricing] = useState<PricingSettings>({ rates: { ...defaultRates }, minimumFee: 1500, vatIncluded: false, vatRate: 0.15 });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/pricing")
      .then((r) => r.json())
      .then((data) => setPricing((p) => ({ ...p, ...data, rates: { ...defaultRates, ...data.rates } })))
      .catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch("/api/admin/pricing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(pricing) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <p className="ui-kicker">Content</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 800, color: "var(--navy)", marginTop: "6px" }}>Pricing Settings</h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>Set per-unit rates used by the online quote tool.</p>
        </div>
        <button
          className="ui-btn ui-btn-primary"
          onClick={save}
          disabled={saving}
          style={{ opacity: saving ? 0.7 : 1 }}
        >
          {saved ? "✓ Saved!" : saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Service rates */}
        <div className="ui-card" style={{ padding: "24px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--navy)", marginBottom: "20px" }}>
            Service Rates (ZAR)
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {serviceFields.map((f) => (
              <div key={f.key} style={{ display: "grid", gridTemplateColumns: "1fr auto 120px", alignItems: "center", gap: "12px" }}>
                <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--navy)" }}>{f.label}</label>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "6px", padding: "3px 8px" }}>
                  per {f.unit}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600 }}>R</span>
                  <input
                    className="ui-input"
                    type="number"
                    min="0"
                    value={pricing.rates[f.key] ?? 0}
                    onChange={(e) => setPricing({ ...pricing, rates: { ...pricing.rates, [f.key]: Number(e.target.value) } })}
                    style={{ padding: "7px 10px" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global settings */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="ui-card" style={{ padding: "24px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--navy)", marginBottom: "18px" }}>Global Settings</h2>
            <div className="ui-form-group">
              <label className="ui-label">Minimum Fee (ZAR)</label>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600 }}>R</span>
                <input className="ui-input" type="number" min="0" value={pricing.minimumFee} onChange={(e) => setPricing({ ...pricing, minimumFee: Number(e.target.value) })} />
              </div>
            </div>
            <div className="ui-form-group" style={{ margin: 0 }}>
              <label className="ui-label">VAT Rate</label>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <input className="ui-input" type="number" min="0" max="1" step="0.01" value={pricing.vatRate} onChange={(e) => setPricing({ ...pricing, vatRate: Number(e.target.value) })} />
                <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600, whiteSpace: "nowrap" }}>
                  = {(pricing.vatRate * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          <div className="ui-card" style={{ padding: "24px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--navy)", marginBottom: "16px" }}>VAT</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <input type="checkbox" id="vat" checked={pricing.vatIncluded} onChange={(e) => setPricing({ ...pricing, vatIncluded: e.target.checked })} style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }} />
              <label htmlFor="vat" style={{ fontSize: "14px", color: "var(--navy)", fontWeight: 500 }}>
                Add VAT to all quotes
              </label>
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "10px", lineHeight: 1.6 }}>
              When enabled, VAT at {(pricing.vatRate * 100).toFixed(0)}% will be added to every quote total.
            </p>
          </div>

          {/* Preview */}
          <div className="ui-card" style={{ padding: "20px", background: "#F0F9FF", border: "1px solid #BAE6FD" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#0c4a6e", marginBottom: "8px" }}>Example: 100m² roof</p>
            {(() => {
              const rate = pricing.rates.roof ?? 35;
              const subtotal = Math.max(100 * rate, pricing.minimumFee);
              const vat = pricing.vatIncluded ? subtotal * pricing.vatRate : 0;
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "#0c4a6e" }}>100 × R{rate}/m²</span>
                    <span style={{ fontWeight: 600, color: "#0c4a6e" }}>{formatCurrency(100 * rate, { decimals: 0 })}</span>
                  </div>
                  {pricing.vatIncluded && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                      <span style={{ color: "#0c4a6e" }}>VAT ({(pricing.vatRate * 100).toFixed(0)}%)</span>
                      <span style={{ fontWeight: 600, color: "#0c4a6e" }}>{formatCurrency(vat, { decimals: 0 })}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: 700, borderTop: "1px solid #BAE6FD", paddingTop: "6px", marginTop: "4px" }}>
                    <span style={{ color: "#0c4a6e" }}>Total</span>
                    <span style={{ color: "#0c4a6e" }}>{formatCurrency(subtotal + vat, { decimals: 0 })}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

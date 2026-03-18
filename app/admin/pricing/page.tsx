"use client";

import { useEffect, useState } from "react";

type PricingSettings = {
  rates: Record<string, number>;
  minimumFee: number;
  vatIncluded: boolean;
  vatRate: number;
};

const serviceFields: { key: keyof PricingSettings["rates"]; label: string; unit: "m2" | "m" | "units" }[] = [
  { key: "roof", label: "Roof", unit: "m2" },
  { key: "gutters", label: "Gutters", unit: "m" },
  { key: "driveway", label: "Driveway", unit: "m2" },
  { key: "tiles", label: "Tiles", unit: "m2" },
  { key: "wall", label: "Walls", unit: "m" },
  { key: "house_wash", label: "House wash", unit: "m" },
  { key: "miscellaneous", label: "Miscellaneous", unit: "m2" },
  { key: "windows", label: "Windows", unit: "units" },
  { key: "solar_panels", label: "Solar panels", unit: "units" },
];

const defaultRates = serviceFields.reduce<Record<string, number>>((acc, field) => {
  acc[field.key] = 0;
  return acc;
}, {});

export default function PricingPage() {
  const [pricing, setPricing] = useState<PricingSettings>({
    rates: { ...defaultRates },
    minimumFee: 1500,
    vatIncluded: false,
    vatRate: 0.15,
  });
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [loadStatus, setLoadStatus] = useState<"idle" | "error">("idle");
  const [loadMessage, setLoadMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoadStatus("idle");
      setLoadMessage("");
      try {
        const res = await fetch("/api/admin/pricing");
        if (!res.ok) {
          const error = await res.json().catch(() => ({}));
          const message = error?.details || error?.error || `Unable to load pricing (${res.status})`;
          throw new Error(message);
        }
        const text = await res.text();
        if (!text) {
          return;
        }
        const data = JSON.parse(text);
        setPricing((prev) => ({
          ...prev,
          ...data,
          rates: { ...defaultRates, ...(data?.rates || {}) },
          vatRate: 0.15,
        }));
      } catch (error) {
        setLoadStatus("error");
        setLoadMessage(error instanceof Error ? error.message : "Unable to load pricing");
      }
    };
    load();
  }, []);

  const updateRate = (key: string, value: number) => {
    setPricing((prev) => ({ ...prev, rates: { ...prev.rates, [key]: value } }));
  };

  const save = async () => {
    setSaving(true);
    setSaveStatus("idle");
    setSaveMessage("");
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pricing),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        const message = error?.details || error?.error || `Save failed (${res.status})`;
        throw new Error(message);
      }
      const saved = await res.json();
      setPricing((prev) => ({
        ...prev,
        ...saved,
        rates: { ...defaultRates, ...(saved?.rates || {}) },
      }));
      setSaveStatus("success");
      setSaveMessage("Pricing saved.");
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error instanceof Error ? error.message : "Unable to save pricing");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Pricing</h1>
        <p className="text-sm text-slate-600">
          Set per-service rates used for quotes. Driveways, roofs, tiles, and miscellaneous use m2. All other services
          are priced per linear meter or unit count. Measurements entered by clients are multiplied by the rates below.
        </p>
        {loadMessage ? <p className="text-sm text-rose-600">{loadMessage}</p> : null}
      </div>

      <div className="space-y-4 ui-card p-4 ring-1 ring-slate-200/60">
        {serviceFields.map((service) => (
          <div
            key={service.key}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2"
          >
            <div>
              <p className="text-sm font-semibold text-slate-800">{service.label}</p>
              <p className="text-xs text-slate-500">Unit: {service.unit === "units" ? "per unit" : `per ${service.unit}`}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">R</span>
              <input
                type="number"
                min={0}
                className="w-28 ui-input"
                value={pricing.rates[service.key] ?? 0}
                onChange={(e) => updateRate(service.key, Number(e.target.value) || 0)}
              />
              <span className="text-xs text-slate-500">{service.unit === "units" ? "per unit" : `per ${service.unit}`}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 ui-card p-4 ring-1 ring-slate-200/60">
          <label className="text-sm font-semibold text-slate-800">Minimum fee</label>
          <input
            type="number"
            min={0}
            className="w-48 ui-input"
            value={pricing.minimumFee}
            onChange={(e) => setPricing({ ...pricing, minimumFee: Number(e.target.value) || 0 })}
          />
          <p className="text-xs text-slate-500">Quotes will be raised to at least this amount.</p>
        </div>

        <div className="space-y-3 ui-card p-4 ring-1 ring-slate-200/60">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">VAT inclusion</p>
              <p className="text-xs text-slate-500">If enabled, totals include VAT at 15%.</p>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={pricing.vatIncluded}
                onChange={(e) => setPricing({ ...pricing, vatIncluded: e.target.checked, vatRate: 0.15 })}
              />
              Include VAT (15%)
            </label>
          </div>
        </div>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="ui-btn ui-btn-secondary disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save pricing"}
      </button>
      {saveMessage ? (
        <p
          className={`text-sm ${saveStatus === "success" ? "text-emerald-700" : "text-rose-600"}`}
          role="status"
        >
          {saveMessage}
        </p>
      ) : null}
    </div>
  );
}


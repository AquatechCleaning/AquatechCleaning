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

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    homepageHeroTitle: "",
    homepageHeroSubtitle: "",
    homepageHeroImageUrl: "",
    contactPhone: "",
    contactEmail: "",
    companyName: "",
    companyVatNumber: "",
    companyRegNumber: "",
    companyPostalAddress: "",
    companyPhysicalAddress: "",
    companySalesRep: "",
    quoteNumberStart: 1,
  });

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setSettings((prev) => ({ ...prev, ...data }));
    };
    load();
  }, []);

  const save = async () => {
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Site Settings</h1>
        <p className="text-sm text-slate-600">Control hero copy, imagery, and contact details.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="ui-card p-4 space-y-3">
          <label className="text-sm text-slate-600">Homepage hero title</label>
          <input
            className="ui-input"
            value={settings.homepageHeroTitle}
            onChange={(e) => setSettings({ ...settings, homepageHeroTitle: e.target.value })}
          />
          <label className="text-sm text-slate-600">Homepage hero subtitle</label>
          <input
            className="ui-input"
            value={settings.homepageHeroSubtitle}
            onChange={(e) => setSettings({ ...settings, homepageHeroSubtitle: e.target.value })}
          />
          <label className="text-sm text-slate-600">Hero image URL</label>
          <input
            className="ui-input"
            value={settings.homepageHeroImageUrl}
            onChange={(e) => setSettings({ ...settings, homepageHeroImageUrl: e.target.value })}
          />
        </div>
        <div className="ui-card p-4 space-y-3">
          <label className="text-sm text-slate-600">Contact phone</label>
          <input
            className="ui-input"
            value={settings.contactPhone}
            onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
          />
          <label className="text-sm text-slate-600">Contact email</label>
          <input
            className="ui-input"
            value={settings.contactEmail}
            onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
          />
          <button
            onClick={save}
            className="mt-4 ui-btn ui-btn-secondary"
          >
            Save settings
          </button>
        </div>
        <div className="ui-card p-4 space-y-3 md:col-span-2">
          <h3 className="text-sm font-semibold text-slate-800">Quote settings</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm text-slate-600">Quote number start</label>
              <input
                className="ui-input"
                type="number"
                min={1}
                value={settings.quoteNumberStart ?? 1}
                onChange={(e) => setSettings({ ...settings, quoteNumberStart: Number(e.target.value) || 1 })}
              />
              <p className="text-xs text-slate-500">First quote number used when no counter exists.</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-600">Sales rep</label>
              <input
                className="ui-input"
                value={settings.companySalesRep}
                onChange={(e) => setSettings({ ...settings, companySalesRep: e.target.value })}
              />
            </div>
          </div>
        </div>
        <div className="ui-card p-4 space-y-3 md:col-span-2">
          <h3 className="text-sm font-semibold text-slate-800">Company details (Quote PDF)</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              className="ui-input"
              placeholder="Company name"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
            />
            <input
              className="ui-input"
              placeholder="Company VAT number"
              value={settings.companyVatNumber}
              onChange={(e) => setSettings({ ...settings, companyVatNumber: e.target.value })}
            />
            <input
              className="ui-input"
              placeholder="Company registration number"
              value={settings.companyRegNumber}
              onChange={(e) => setSettings({ ...settings, companyRegNumber: e.target.value })}
            />
            <div />
            <textarea
              className="ui-input"
              placeholder="Company postal address"
              rows={4}
              value={settings.companyPostalAddress}
              onChange={(e) => setSettings({ ...settings, companyPostalAddress: e.target.value })}
            />
            <textarea
              className="ui-input"
              placeholder="Company physical address"
              rows={4}
              value={settings.companyPhysicalAddress}
              onChange={(e) => setSettings({ ...settings, companyPhysicalAddress: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


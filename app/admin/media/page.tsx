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

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [form, setForm] = useState<MediaItem>({
    title: "",
    imageBeforeUrl: "",
    imageAfterUrl: "",
    serviceType: "",
    locationLabel: "",
    featured: true,
  });

  const load = async () => {
    const res = await fetch("/api/media");
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    await fetch("/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({
      title: "",
      imageBeforeUrl: "",
      imageAfterUrl: "",
      serviceType: "",
      locationLabel: "",
      featured: true,
    });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Before/After Media</h1>
        <p className="text-sm text-slate-600">Showcase featured projects.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="ui-card p-4 space-y-3">
          <input
            className="ui-input"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="ui-input"
            placeholder="Before image URL"
            value={form.imageBeforeUrl}
            onChange={(e) => setForm({ ...form, imageBeforeUrl: e.target.value })}
          />
          <input
            className="ui-input"
            placeholder="After image URL"
            value={form.imageAfterUrl}
            onChange={(e) => setForm({ ...form, imageAfterUrl: e.target.value })}
          />
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-700">Featured</label>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
          </div>
          <button
            onClick={submit}
            className="ui-btn ui-btn-secondary"
          >
            Save media item
          </button>
          <p className="text-xs text-slate-500">
            TODO: connect to real file storage (S3/Cloudflare R2). Currently expects public URLs.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item._id} className="ui-card overflow-hidden shadow-sm">
              <div className="grid grid-cols-2">
                <img src={item.imageBeforeUrl} alt="before" className="h-24 w-full object-cover" />
                <img src={item.imageAfterUrl} alt="after" className="h-24 w-full object-cover" />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-slate-500">{item.locationLabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


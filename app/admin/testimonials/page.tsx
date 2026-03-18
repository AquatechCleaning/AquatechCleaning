"use client";

import { useEffect, useState } from "react";

type Testimonial = {
  _id?: string;
  name: string;
  location?: string;
  rating: number;
  comment: string;
  featured?: boolean;
};

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [form, setForm] = useState<Testimonial>({
    name: "",
    location: "",
    rating: 5,
    comment: "",
    featured: true,
  });

  const load = async () => {
    const res = await fetch("/api/testimonials");
    setItems(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    await fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", location: "", rating: 5, comment: "", featured: true });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Testimonials</h1>
        <p className="text-sm text-slate-600">Curate featured testimonials.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="ui-card p-4 space-y-3">
          <input
            className="ui-input"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="ui-input"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <input
            className="ui-input"
            placeholder="Rating (0-5)"
            type="number"
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
          />
          <textarea
            className="ui-input"
            placeholder="Comment"
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
          />
          <button
            onClick={submit}
            className="ui-btn ui-btn-secondary"
          >
            Save testimonial
          </button>
        </div>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="ui-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.location}</p>
                </div>
                <span className="text-xs font-semibold text-amber-500">* {item.rating}</span>
              </div>
              <p className="mt-2 text-sm text-slate-700">{item.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


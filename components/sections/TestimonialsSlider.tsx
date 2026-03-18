"use client";

import { useState } from "react";

type Testimonial = {
  _id: string;
  name: string;
  location?: string;
  rating: number;
  comment: string;
};

export function TestimonialsSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="rounded-2xl border border-[#d2d5c6] bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">Add testimonials in the admin area to showcase social proof.</p>
      </div>
    );
  }

  const current = testimonials[index];

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#d2d5c6] bg-white p-6 shadow-[0_10px_26px_rgba(2,32,61,0.1)] reveal-up">
      <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-[#f0a935]/15" />
      <div className="relative flex justify-between">
        <div>
          <p className="text-sm font-semibold text-[#02203D]">{current.name}</p>
          <p className="text-xs text-slate-500">{current.location}</p>
        </div>
        <div className="text-sm font-semibold text-amber-500">* {current.rating}</div>
      </div>
      <p className="relative mt-4 leading-7 text-slate-700">{current.comment}</p>
      <div className="relative mt-6 flex items-center justify-between text-sm text-slate-500">
        <button onClick={prev} className="rounded-full border border-[#d2d5c6] bg-white px-3 py-1 font-semibold text-slate-700 hover:bg-slate-100">
          Prev
        </button>
        <div>
          {index + 1} / {testimonials.length}
        </div>
        <button onClick={next} className="rounded-full bg-[#055178] px-3 py-1 font-semibold text-white hover:bg-[#0d4f85]">
          Next
        </button>
      </div>
    </div>
  );
}

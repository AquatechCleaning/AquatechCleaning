"use client";

import { useMemo, useState } from "react";

type GalleryPair = {
  id: string;
  beforeSrc: string;
  afterSrc: string;
  altBefore: string;
  altAfter: string;
};

const galleryPairs: GalleryPair[] = [
  {
    id: "driveway-1",
    beforeSrc: "https://picsum.photos/seed/aquatech-before-1/900/620",
    afterSrc: "https://picsum.photos/seed/aquatech-after-1/900/620",
    altBefore: "Driveway before pressure cleaning",
    altAfter: "Driveway after pressure cleaning",
  },
  {
    id: "roof-1",
    beforeSrc: "https://picsum.photos/seed/aquatech-before-2/900/620",
    afterSrc: "https://picsum.photos/seed/aquatech-after-2/900/620",
    altBefore: "Roof before wash",
    altAfter: "Roof after wash",
  },
  {
    id: "paving-1",
    beforeSrc: "https://picsum.photos/seed/aquatech-before-3/900/620",
    afterSrc: "https://picsum.photos/seed/aquatech-after-3/900/620",
    altBefore: "Paving before cleaning",
    altAfter: "Paving after cleaning",
  },
  {
    id: "walls-1",
    beforeSrc: "https://picsum.photos/seed/aquatech-before-4/900/620",
    afterSrc: "https://picsum.photos/seed/aquatech-after-4/900/620",
    altBefore: "Exterior wall before soft wash",
    altAfter: "Exterior wall after soft wash",
  },
  {
    id: "deck-1",
    beforeSrc: "https://picsum.photos/seed/aquatech-before-5/900/620",
    afterSrc: "https://picsum.photos/seed/aquatech-after-5/900/620",
    altBefore: "Deck before restoration",
    altAfter: "Deck after restoration",
  },
  {
    id: "commercial-1",
    beforeSrc: "https://picsum.photos/seed/aquatech-before-6/900/620",
    afterSrc: "https://picsum.photos/seed/aquatech-after-6/900/620",
    altBefore: "Commercial surface before cleaning",
    altAfter: "Commercial surface after cleaning",
  },
];

type LightboxState = { src: string; alt: string } | null;

export function BeforeAfterGrid() {
  const [lightbox, setLightbox] = useState<LightboxState>(null);
  const pairs = useMemo(() => galleryPairs, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <div className="mb-8 flex items-end justify-between gap-4 border-b border-[#d2d5c6] pb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#02203D] sm:text-3xl">Before and After Results</h2>
          <p className="mt-2 text-sm text-slate-700">Tap any image to view it larger.</p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {pairs.map((pair) => (
          <article
            key={pair.id}
            className="rounded-2xl border border-[#d2d5c6] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <button className="text-left" onClick={() => setLightbox({ src: pair.beforeSrc, alt: pair.altBefore })}>
                <span className="mb-2 inline-block rounded-full border border-[#d2d5c6] bg-[#fbf8e5] px-3 py-1 text-xs font-semibold text-[#02203D]">
                  Before
                </span>
                <img
                  src={pair.beforeSrc}
                  alt={pair.altBefore}
                  className="h-44 w-full rounded-lg border border-[#d2d5c6] object-cover"
                />
              </button>
              <button className="text-left" onClick={() => setLightbox({ src: pair.afterSrc, alt: pair.altAfter })}>
                <span className="mb-2 inline-block rounded-full border border-[#d2d5c6] bg-[#fbf8e5] px-3 py-1 text-xs font-semibold text-[#02203D]">
                  After
                </span>
                <img
                  src={pair.afterSrc}
                  alt={pair.altAfter}
                  className="h-44 w-full rounded-lg border border-[#d2d5c6] object-cover"
                />
              </button>
            </div>
          </article>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#02203D]/80 p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="w-full max-w-4xl rounded-2xl border border-[#d2d5c6] bg-white p-3 shadow-xl">
            <img src={lightbox.src} alt={lightbox.alt} className="max-h-[75vh] w-full rounded-xl object-contain" />
            <div className="mt-2 flex justify-end">
              <button
                className="rounded-full bg-[#f0a935] px-4 py-2 text-sm font-semibold text-[#02203D] hover:bg-[#dd982d]"
                onClick={() => setLightbox(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

import Link from "next/link";
import { siteConfig } from "@/config/site";

export function GalleryHero() {
  return (
    <section className="border-b border-[#d2d5c6] bg-gradient-to-br from-[#fbf8e5] via-white to-[#d2d5c6]/45">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#055178]">Gallery</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-[#02203D] sm:text-5xl">Excellence in Action</h1>
        <p className="mt-3 text-base font-medium text-[#055178] sm:text-lg">Proof you can see in every clean.</p>
        <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-700 sm:text-base">
          Browse real before-and-after outcomes across residential and commercial jobs. Every pair shows the same
          surface captured before treatment and after our team has completed the restoration.
        </p>
        <Link
          href={siteConfig.cta.book}
          className="mt-7 inline-flex rounded-full bg-[#f0a935] px-6 py-3 text-sm font-semibold text-[#02203D] shadow-sm transition hover:bg-[#dd982d]"
        >
          BOOK NOW
        </Link>
      </div>
    </section>
  );
}

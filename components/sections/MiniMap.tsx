export function MiniMap() {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-4 reveal-up">
      <div className="rounded-3xl border border-[#d2d5c6] bg-white p-6 shadow-[0_12px_28px_rgba(2,32,61,0.1)]">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-2xl font-semibold text-[#02203D]">Serving Cape Town and surrounds</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Northern and Southern suburbs, Atlantic Seaboard, Stellenbosch, Paarl, and the Winelands.
              If you are outside these areas, reach out - we frequently travel for larger commercial
              work.
            </p>
          </div>
          <div className="float-soft h-56 rounded-2xl border border-[#d2d5c6] bg-gradient-to-br from-[#055178]/15 via-white to-[#f0a935]/25 p-3">
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-[#055178]/40 bg-white/70 text-sm text-slate-600">
              Map placeholder - connect Google Maps embed if desired.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type MediaItem = {
  _id: string;
  title: string;
  locationLabel?: string;
  imageBeforeUrl: string;
  imageAfterUrl: string;
};

async function getMedia() {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";
  const url = new URL("/api/media", base);
  url.searchParams.set("featured", "true");

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function BeforeAfterGallery() {
  const media: MediaItem[] = await getMedia();

  return (
    <section className="mx-auto mt-16 max-w-6xl px-4 reveal-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#02203D]">Recent transformations</h2>
          <p className="mt-1 text-sm text-slate-600">
            Featured before/after pairs curated from our portfolio.
          </p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {media.length === 0 && (
          <div className="rounded-2xl border border-[#d2d5c6] bg-white p-6 text-sm text-slate-600 shadow-sm">
            Upload featured media in the admin panel to populate this gallery.
          </div>
        )}
        {media.map((item) => (
          <div key={item._id} className="group overflow-hidden rounded-2xl border border-[#d2d5c6] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="grid grid-cols-2">
              <img src={item.imageBeforeUrl} alt="before" className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" />
              <img src={item.imageAfterUrl} alt="after" className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" />
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold text-[#02203D]">{item.title}</p>
              <p className="text-xs text-slate-500">{item.locationLabel}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

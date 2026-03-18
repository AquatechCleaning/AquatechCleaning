import { TestimonialsSlider } from "./TestimonialsSlider";

type Testimonial = {
  _id: string;
  name: string;
  location?: string;
  rating: number;
  comment: string;
};

async function getTestimonials() {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";
  const url = new URL("/api/testimonials", base);
  url.searchParams.set("featured", "true");

  const res = await fetch(url.toString(), {
    next: { revalidate: 1800 },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function Testimonials() {
  const testimonials: Testimonial[] = await getTestimonials();

  return (
    <section className="mx-auto mt-16 max-w-6xl px-4 reveal-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#02203D]">Loved by Cape Town homeowners</h2>
          <p className="mt-1 text-sm text-slate-600">
            Real feedback from repeat clients who trust us with their properties.
          </p>
        </div>
      </div>
      <div className="mt-6">
        <TestimonialsSlider testimonials={testimonials} />
      </div>
    </section>
  );
}

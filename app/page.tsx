import Link from "next/link";
import { HeroBanner } from "@/components/home/HeroBanner";
import { StatsBlock } from "@/components/sections/StatsBlock";
import { TestimonialsSlider } from "@/components/sections/TestimonialsSlider";
import { BeforeAfterGallery } from "@/components/sections/BeforeAfterGallery";
import { ServiceAreaMap } from "@/components/sections/ServiceAreaMap";

type PublicStats = {
  clientsServed: number;
  totalSqmCleaned: number;
  averageRating: number;
  repeatCustomerRate: number;
};
type Testimonial = { _id: string; name: string; location?: string; rating: number; comment: string };
type MediaItem = { _id: string; title: string; locationLabel?: string; imageBeforeUrl: string; imageAfterUrl: string };

async function getStats(): Promise<PublicStats> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    const res = await fetch(new URL("/api/stats/public", base).toString(), { next: { revalidate: 60 } });
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    return { clientsServed: 0, totalSqmCleaned: 0, averageRating: 0, repeatCustomerRate: 0 };
  }
}

async function getTestimonials(): Promise<Testimonial[]> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    const url = new URL("/api/testimonials", base);
    url.searchParams.set("featured", "true");
    const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
    if (!res.ok) throw new Error();
    return res.json();
  } catch { return []; }
}

async function getMedia(): Promise<MediaItem[]> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    const url = new URL("/api/media", base);
    url.searchParams.set("featured", "true");
    const res = await fetch(url.toString(), { next: { revalidate: 1200 } });
    if (!res.ok) throw new Error();
    return res.json();
  } catch { return []; }
}

const services = [
  { icon: "☀️", title: "Solar Panel Cleaning", desc: "RoDi (Reverse Osmosis, De-ionized) pure water technology. No chemicals, no residue buildup, optimal efficiency and cleanliness maintained.", href: "/services#solar" },
  { icon: "🪟", title: "Window Cleaning", desc: "Sparkling windows without chemicals or soaps using our RoDi technology. No residue means dirt can't cling, keeping windows cleaner and shinier for longer.", href: "/services#windows" },
  { icon: "🏠", title: "Roof Cleaning", desc: "Expert pressure washing and Softwashing to eliminate existing organic growth and inhibit future growth, leaving you with the cleanest roof in the neighbourhood.", href: "/services#roof" },
  { icon: "🏗️", title: "Gutter Cleaning & Whitening", desc: "Clears blockages and removes black tiger stripes, ensuring proper drainage and enhancing your exterior's curb appeal.", href: "/services#gutters" },
  { icon: "🛣️", title: "Patio, Driveway & Paving", desc: "Advanced pressure washing and soft washing prevent micro flooding, slip hazards and surface deterioration with thorough removal of dirt and organic growth.", href: "/services#driveway" },
  { icon: "🌿", title: "Deck & Wood Cleaning", desc: "Specialised pressure and soft washing revitalises wooden fencing, decks, and other surfaces, restoring their pristine appearance and making them look brand new.", href: "/services#deck" },
];

const processSteps = [
  { step: "01", title: "Draw your area", body: "Use our Google Maps tool to draw the surfaces you need cleaned. We calculate the m² instantly." },
  { step: "02", title: "Get your estimate", body: "Our pricing engine generates a quote in seconds. No guesswork, no waiting." },
  { step: "03", title: "We confirm & book", body: "Our team reviews the quote and confirms within 1 business day with a finalised schedule." },
  { step: "04", title: "Spotless results", body: "Fully insured crews, detailed after-photos, and a satisfaction guarantee on every job." },
];

export default async function Home() {
  const [stats, testimonials, media] = await Promise.all([getStats(), getTestimonials(), getMedia()]);

  const statItems = [
    { label: "Clients Served", value: stats.clientsServed || 500, suffix: "+" },
    { label: "m² Cleaned", value: stats.totalSqmCleaned || 12400, suffix: "+", decimals: 0 },
    { label: "Avg Rating", value: stats.averageRating || 5.0, suffix: " / 5.0", decimals: 1 },
    { label: "Return Clients", value: stats.repeatCustomerRate || 85, suffix: "%", decimals: 0 },
  ];

  return (
    <>
      <HeroBanner />

      {/* Stats */}
      <section className="sec" style={{ background: "#fff", borderBottom: "1px solid var(--border)", padding: "32px 0" }}>
        <div className="ui-container">
          <StatsBlock stats={statItems} />
        </div>
      </section>

      {/* Services */}
      <section className="sec" style={{ background: "var(--bg)", padding: "80px 0" }}>
        <div className="ui-container">
          <div className="ui-section-header reveal-up">
            <p className="ui-kicker">What We Do</p>
            <h2 className="ui-title" style={{ marginTop: "8px" }}>Expert exterior cleaning, top to bottom</h2>
            <p className="ui-subtitle" style={{ marginTop: "12px", maxWidth: "520px" }}>
              Transparent pricing, careful execution, and equipment suited to each surface type.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {services.map((s, i) => (
              <Link
                key={s.title}
                href={s.href}
                className={`ui-card ui-card-hover reveal-up reveal-up-d${Math.min(i + 1, 4)}`}
                style={{
                  padding: "24px",
                  textDecoration: "none",
                  display: "block",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0,
                    height: "3px",
                    background: "var(--accent)",
                    transform: "scaleX(0)",
                    transformOrigin: "left",
                    transition: "transform 220ms ease",
                  }}
                  className="service-accent-bar"
                />
                <div
                  style={{
                    width: "44px", height: "44px",
                    borderRadius: "12px",
                    background: "#EFF6FF",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "20px",
                    marginBottom: "14px",
                  }}
                >
                  {s.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "var(--navy)",
                    marginBottom: "8px",
                  }}
                >
                  {s.title}
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7 }}>{s.desc}</p>
                <p style={{ marginTop: "14px", fontSize: "12px", fontWeight: 700, color: "var(--primary)" }}>
                  Learn more →
                </p>
              </Link>
            ))}
          </div>
        </div>
        <style>{`.ui-card-hover:hover .service-accent-bar { transform: scaleX(1) !important; }`}</style>
      </section>

      {/* How it works */}
      <section className="sec" style={{ background: "#fff", padding: "80px 0" }}>
        <div className="ui-container">
          <div className="ui-section-header reveal-up" style={{ textAlign: "center" }}>
            <p className="ui-kicker">Our Process</p>
            <h2 className="ui-title" style={{ marginTop: "8px" }}>From quote to clean in 4 steps</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" }}>
            {processSteps.map((p, i) => (
              <div key={p.step} className={`reveal-up reveal-up-d${i + 1}`} style={{ textAlign: "center", padding: "8px" }}>
                <div
                  style={{
                    width: "52px", height: "52px",
                    borderRadius: "14px",
                    background: "var(--navy)",
                    color: "var(--accent)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontSize: "16px",
                    fontWeight: 800,
                    margin: "0 auto 16px",
                  }}
                >
                  {p.step}
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, color: "var(--navy)", marginBottom: "8px" }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7 }}>{p.body}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link href="/quote" className="ui-btn ui-btn-primary">
              Get My Instant Quote →
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {media.length > 0 && (
        <section className="sec" style={{ background: "var(--bg)", padding: "80px 0" }}>
          <div className="ui-container">
            <div className="ui-section-header section-flex-header reveal-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <p className="ui-kicker">Our Work</p>
                <h2 className="ui-title" style={{ marginTop: "8px" }}>Recent transformations</h2>
              </div>
              <Link href="/gallery" className="ui-btn ui-btn-ghost" style={{ flexShrink: 0 }}>View all →</Link>
            </div>
            <BeforeAfterGallery media={media.slice(0, 6)} />
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="sec" style={{ background: "#fff", padding: "80px 0" }}>
        <div className="ui-container">
          <div className="ui-section-header reveal-up">
            <p className="ui-kicker">Client Feedback</p>
            <h2 className="ui-title" style={{ marginTop: "8px" }}>Loved by Cape Town homeowners</h2>
            <p className="ui-subtitle" style={{ marginTop: "12px" }}>
              Real reviews from repeat clients who trust us with their properties.
            </p>
          </div>
          <TestimonialsSlider testimonials={testimonials} />
        </div>
      </section>

      {/* Service area */}
      <section className="sec" style={{ background: "var(--navy)", padding: "64px 0" }}>
        <div className="ui-container">
          <div className="rsp-grid-2" style={{ gap: "48px", alignItems: "center" }}>
            <div className="reveal-up">
              <p className="ui-kicker" style={{ color: "var(--accent)" }}>Service Area</p>
              <h2 className="ui-title" style={{ color: "#fff", marginTop: "8px" }}>
                Serving Cape Town and surrounds
              </h2>
              <p style={{ color: "rgba(255,255,255,0.65)", marginTop: "16px", lineHeight: 1.8, fontSize: "15px" }}>
                Cape Town, Atlantic Seaboard, Southern &amp; Northern Suburbs, False Bay, Stellenbosch, Paarl, Franschhoek, Grabouw, Yzerfontein &amp; Langebaan.
              </p>
              <div style={{ marginTop: "28px", display: "flex", gap: "12px" }}>
                <Link href="/contact" className="ui-btn ui-btn-primary">Contact Us</Link>
                <Link href="/quote" className="ui-btn ui-btn-outline-light">Get a Quote</Link>
              </div>
            </div>
            <div
              className="reveal-up reveal-up-d2"
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                aspectRatio: "4/3",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <ServiceAreaMap />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { SeoServicePage as SeoServicePageData } from "@/lib/seoServicePages";

export function SeoServicePage({ page }: { page: SeoServicePageData }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.title,
    description: page.metaDescription,
    provider: {
      "@type": "LocalBusiness",
      "@id": "https://aquatechcleaning.co.za/#business",
      name: "Aquatech Cleaning",
    },
    areaServed: {
      "@type": "City",
      name: "Cape Town",
    },
    mainEntityOfPage: `https://aquatechcleaning.co.za/${page.slug}`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main style={{ background: "var(--bg)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="page-hero" style={{ background: "var(--navy)", padding: "64px 0 80px", position: "relative", overflow: "hidden" }}>
        <div className="ui-container" style={{ position: "relative" }}>
          <p className="ui-kicker" style={{ color: "var(--accent)" }}>Cape Town Exterior Cleaning</p>
          <h1 className="ui-title" style={{ color: "#fff", marginTop: "8px", marginBottom: "12px" }}>{page.h1}</h1>
          <p className="ui-subtitle" style={{ color: "rgba(255,255,255,0.72)", maxWidth: "620px" }}>{page.intro}</p>
          <div style={{ display: "flex", gap: "12px", marginTop: "28px", flexWrap: "wrap" }}>
            <Link href="/quote" className="ui-btn ui-btn-primary">Get an Instant Quote</Link>
            <Link href="/contact" className="ui-btn ui-btn-outline-light">Speak to Aquatech</Link>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40px", background: "var(--bg)", clipPath: "ellipse(60% 100% at 50% 100%)" }} />
      </section>

      <section className="ui-container pg-body" style={{ padding: "60px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "18px", marginBottom: "44px" }}>
          {page.sections.map((section) => (
            <article key={section.title} className="ui-card" style={{ padding: "26px" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--navy)", marginBottom: "10px" }}>{section.title}</h2>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.8 }}>{section.body}</p>
            </article>
          ))}
        </div>

        <div className="ui-card" style={{ padding: "32px" }}>
          <p className="ui-kicker">Questions</p>
          <h2 className="ui-title" style={{ fontSize: "28px", marginTop: "8px", marginBottom: "22px" }}>Common questions</h2>
          <div style={{ display: "grid", gap: "18px" }}>
            {page.faqs.map((faq) => (
              <div key={faq.question}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "16px", color: "var(--navy)", marginBottom: "6px" }}>{faq.question}</h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.7 }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

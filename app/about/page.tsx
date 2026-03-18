
import { Container } from "@/components/template/Container";
import { PageHeader } from "@/components/template/PageHeader";
import { Card } from "@/components/template/Card";

const highlights = [
  "10+ years of exterior cleaning across the Western Cape.",
  "Fully insured crews with safety gear for heights and confined spaces.",
  "Modern equipment: rotary surface cleaners, soft-wash rigs, and water capture.",
  "Detailed reporting, photos, and recommendations after every job.",
];

export default function AboutPage() {
  return (
    <div className="ui-shell">
      <Container className="ui-page space-y-10">
        <PageHeader
          title="Aqua-tech precision with hands-on service."
          subtitle="Aquatech Cleaning is a Cape Town crew focused on quality, safety, and respect for your property."
          breadcrumb={[{ label: "Home", href: "/" }, { label: "About" }]}
        />
        <Card className="ui-card p-6">
          <h2 className="text-xl font-semibold text-[#02203D]">Why clients stay with us</h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#f0a935]" />
                {item}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="ui-card p-6">
          <h2 className="text-xl font-semibold text-[#02203D]">Our story</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            We started with roof cleaning and gutter work, then expanded into paving, walls, and commercial
            exteriors as clients asked for a single trusted provider. Every project includes a safety plan,
            gear suited to the surface, and respectful crews who leave your space clean.
          </p>
        </Card>
      </Container>
    </div>
  );
}



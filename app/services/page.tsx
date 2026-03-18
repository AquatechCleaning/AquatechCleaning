import Link from "next/link";
import { Container } from "@/components/template/Container";
import { PageHeader } from "@/components/template/PageHeader";
import { Card } from "@/components/template/Card";

const services = [
  {
    title: "Roof Cleaning",
    description:
      "Soft-wash systems, anti-moss treatments, and careful pressure for tiles, sheeting, and gutters.",
    bullets: [
      "Safe access and fall protection",
      "Moss, lichen, and algae removal",
      "Gutter clearing and flushing",
      "Post-clean inspection and photos",
    ],
  },
  {
    title: "Driveway & Paving",
    description: "High-pressure cleaning, de-greasing, and re-sanding for driveways, patios, and poolsides.",
    bullets: [
      "Oil stain and tyre mark removal",
      "Weed control between joints",
      "Re-sanding and sealing options",
      "Careful water management",
    ],
  },
  {
    title: "Walls & Facades",
    description: "Gentle facade washing to protect paint and waterproofing while removing pollutants.",
    bullets: [
      "Soft-wash for painted surfaces",
      "Efflorescence and salt stains",
      "Height access with proper gear",
      "Windows and trims protected",
    ],
  },
  {
    title: "Commercial & Industrial",
    description: "Retail parks, warehouses, forecourts, and fleet yards with minimal downtime.",
    bullets: [
      "After-hours and weekend work",
      "Water capture on sensitive sites",
      "Team scaling for tight timelines",
      "Safety documentation on request",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="ui-shell">
      <Container className="ui-page space-y-10">
        <PageHeader
          title="Exterior cleaning built for longevity."
          subtitle="Transparent pricing, careful execution, and equipment suited to each surface."
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Services" }]}
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {services.map((service) => (
            <Card key={service.title} className="ui-card ui-card-hover p-6">
              <h2 className="text-xl font-semibold text-[#02203D]">{service.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {service.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#f0a935]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/quote" className="mt-4 inline-flex text-sm font-semibold text-[#055178]">
                Get an instant quote
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}



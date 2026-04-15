import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get an Instant Quote | Aquatech Cleaning Cape Town",
  description: "Use our map-based tool to measure your property and get an instant cleaning quote in under 2 minutes. Serving Cape Town and the Western Cape.",
  openGraph: {
    title: "Instant Cleaning Quote | Aquatech Cleaning Cape Town",
    description: "Measure your roof, driveway or patio on the map and get a quote instantly. No waiting, no callbacks.",
    url: "https://aquatechcleaning.co.za/quote",
  },
};

export default function QuoteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";
import { SeoServicePage } from "@/components/SeoServicePage";
import { getSeoServicePage } from "@/lib/seoServicePages";

const page = getSeoServicePage("roof-cleaning-cape-town")!;

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.metaDescription,
  alternates: { canonical: `/${page.slug}` },
};

export default function RoofCleaningCapeTownPage() {
  return <SeoServicePage page={page} />;
}

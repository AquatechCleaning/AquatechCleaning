import type { Metadata } from "next";
import { SeoServicePage } from "@/components/SeoServicePage";
import { getSeoServicePage } from "@/lib/seoServicePages";

const page = getSeoServicePage("pressure-washing-cape-town")!;

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.metaDescription,
  alternates: { canonical: `/${page.slug}` },
};

export default function PressureWashingCapeTownPage() {
  return <SeoServicePage page={page} />;
}

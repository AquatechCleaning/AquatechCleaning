import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://aquatechcleaning.co.za";
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/pressure-washing-cape-town`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/soft-washing-cape-town`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/roof-cleaning-cape-town`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/driveway-cleaning-cape-town`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/quote`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/gallery`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}

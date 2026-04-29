import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CookieConsent } from "@/components/CookieConsent";
import { Providers } from "@/components/providers/Providers";
import { TemplateShell } from "@/components/layout/TemplateShell";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aquatech Cleaning | Premium Exterior Cleaning Cape Town",
  description:
    "Professional exterior cleaning for roofs, driveways, paving, and facades across Cape Town and the Western Cape. Instant online quotes.",
  metadataBase: new URL("https://aquatechcleaning.co.za"),
  openGraph: {
    type: "website",
    siteName: "Aquatech Cleaning",
    title: "Aquatech Cleaning | Cape Town's No.1 Exterior Cleaning Service",
    description:
      "Roof, driveway, solar panel, window and deck cleaning across Cape Town and the Western Cape. Get an instant quote in under 2 minutes.",
    url: "https://aquatechcleaning.co.za",
    images: [
      {
        url: "/Logo.png",
        width: 1200,
        height: 630,
        alt: "Aquatech Cleaning — Cape Town Exterior Cleaning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aquatech Cleaning | Cape Town's No.1 Exterior Cleaning Service",
    description:
      "Roof, driveway, solar panel, window and deck cleaning. Get an instant quote in under 2 minutes.",
    images: ["/Logo.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${geist.variable} antialiased`} suppressHydrationWarning>
        <Providers>
          <TemplateShell>{children}</TemplateShell>
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}

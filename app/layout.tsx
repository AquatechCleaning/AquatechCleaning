import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { TemplateShell } from "@/components/template/TemplateShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aquatech Cleaning | Premium Exterior Cleaning",
  description:
    "High-end exterior cleaning for roofs, driveways, paving, and facades across Cape Town and surrounds.",
  metadataBase: new URL("https://aquatechcleaning.co.za"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Passions+Conflict&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/template/css/slick.css" />
        <link rel="stylesheet" href="/template/css/slick-theme.css" />
        <link rel="stylesheet" href="/template/css/style.css" />
        <link rel="stylesheet" href="/template/css/icomoon.css" />
        <link rel="stylesheet" href="/template/css/magnific-popup.css" />
        <link rel="stylesheet" href="/template/css/jquery.fancybox.min.css" />
        <link rel="stylesheet" href="/template/css/slicknav.min.css" />
        <link rel="stylesheet" href="/template/css/animate.css" />
        <link rel="stylesheet" href="/template/css/owl.css" />
        <link rel="stylesheet" href="/template/css/progresscircle.css" />
        <link rel="stylesheet" href="/template/css/fontawesome.min.css" />
        <link rel="stylesheet" href="/template/css/fonts/flaticon/flaticon.css" />
        <link rel="stylesheet" href="/template/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/template/style.css" />
        <link rel="stylesheet" href="/template/css/responsive.css" />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <TemplateShell>{children}</TemplateShell>
        </Providers>
      </body>
    </html>
  );
}

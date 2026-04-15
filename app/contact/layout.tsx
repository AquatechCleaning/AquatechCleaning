import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Aquatech Cleaning Cape Town",
  description: "Get in touch with Aquatech Cleaning. Call, email or send a message — we serve Cape Town and the Western Cape.",
  openGraph: {
    title: "Contact Aquatech Cleaning | Cape Town",
    description: "Reach out to book a clean, ask a question, or get a quote. We respond fast.",
    url: "https://aquatechcleaning.co.za/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

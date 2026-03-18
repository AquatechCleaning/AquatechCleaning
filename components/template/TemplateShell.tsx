"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function TemplateShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bypassShell = pathname.startsWith("/admin");

  if (bypassShell) {
    return <>{children}</>;
  }

  return (
    <div className="ui-shell">
      <Navbar />
      <main className="ui-page">{children}</main>
      <Footer />
    </div>
  );
}


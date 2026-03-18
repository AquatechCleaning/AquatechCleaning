import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-40 border-b border-[#d2d5c6] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/admin/dashboard" className="shrink-0 text-lg font-semibold text-[#02203D]">
            {siteConfig.companyName} Admin
          </Link>
          <nav className="flex min-w-0 flex-nowrap gap-2 overflow-x-auto text-sm">
            <Link href="/admin/dashboard" className="whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              Dashboard
            </Link>
            <Link href="/admin/quotes" className="whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              Quotes
            </Link>
            <Link href="/admin/jobs" className="whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              Jobs
            </Link>
            <Link href="/admin/media" className="whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              Media
            </Link>
            <Link href="/admin/testimonials" className="whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              Testimonials
            </Link>
            <Link href="/admin/pricing" className="whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              Pricing
            </Link>
            <Link href="/admin/settings" className="whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              Settings
            </Link>
            <Link href="/admin/analytics" className="whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              Analytics
            </Link>
            <Link href="/admin/reminders" className="whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              Reminders
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
    </div>
  );
}

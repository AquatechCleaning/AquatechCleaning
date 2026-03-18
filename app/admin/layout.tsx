import Link from "next/link";
import { siteConfig } from "@/config/site";

const navItems = [
  { section: "Overview", links: [
    { href: "/admin/dashboard", label: "Dashboard", icon: "▣" },
    { href: "/admin/analytics", label: "Analytics", icon: "📈" },
  ]},
  { section: "Operations", links: [
    { href: "/admin/quotes", label: "Quotes", icon: "📋" },
    { href: "/admin/jobs", label: "Jobs", icon: "🔧" },
    { href: "/admin/reminders", label: "Reminders", icon: "⏰" },
  ]},
  { section: "Content", links: [
    { href: "/admin/media", label: "Media", icon: "🖼" },
    { href: "/admin/testimonials", label: "Testimonials", icon: "💬" },
    { href: "/admin/pricing", label: "Pricing", icon: "💰" },
    { href: "/admin/settings", label: "Settings", icon: "⚙️" },
  ]},
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        {/* Logo */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: "8px" }}>
          <Link
            href="/admin/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "var(--font-display)",
              fontSize: "14px",
              fontWeight: 800,
              color: "#fff",
              textDecoration: "none",
            }}
          >
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
            {siteConfig.companyName}
            <span
              style={{
                marginLeft: "auto",
                fontSize: "9px",
                background: "var(--accent)",
                color: "var(--navy)",
                padding: "2px 7px",
                borderRadius: "100px",
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              ADMIN
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ padding: "4px 12px", flex: 1 }}>
          {navItems.map((section) => (
            <div key={section.section} style={{ marginBottom: "8px" }}>
              <p
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.28)",
                  padding: "8px 10px 4px",
                }}
              >
                {section.section}
              </p>
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                    marginBottom: "2px",
                  }}
                  className="admin-nav-link"
                >
                  <span style={{ fontSize: "13px", width: "16px", textAlign: "center" }}>{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              color: "rgba(255,255,255,0.4)",
              textDecoration: "none",
            }}
          >
            ← View site
          </Link>
        </div>
      </aside>

      <main className="admin-main">{children}</main>

      <style>{`
        .admin-nav-link:hover { background: rgba(255,255,255,0.07) !important; color: rgba(255,255,255,0.9) !important; }
      `}</style>
    </div>
  );
}

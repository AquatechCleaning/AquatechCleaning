import Link from "next/link";
import { siteConfig } from "@/config/site";

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.272h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

const services = [
  { href: "/services", label: "Roof Cleaning" },
  { href: "/services", label: "Driveway & Paving" },
  { href: "/services", label: "Window & Solar Cleaning" },
  { href: "/services", label: "Gutter Cleaning" },
  { href: "/services", label: "Deck & Wood Cleaning" },
];
const company = [
  { href: "/about", label: "About Us" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/quote", label: "Get a Quote" },
];

export function Footer() {
  return (
    <footer style={{ background: "var(--navy)", color: "rgba(255,255,255,0.7)" }}>
      {/* CTA strip */}
      <div
        style={{
          background: "var(--primary)",
          padding: "32px 0",
        }}
      >
        <div
          className="ui-container footer-cta-inner"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "20px",
                fontWeight: 800,
                color: "#fff",
                marginBottom: "4px",
              }}
            >
              Ready to restore your property?
            </p>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px" }}>
              Get an instant quote using our map-based tool. Takes under 2 minutes.
            </p>
          </div>
          <Link href="/quote" className="ui-btn ui-btn-primary">
            Get Instant Quote →
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="ui-container" style={{ padding: "56px 24px 32px" }}>
        <div className="rsp-grid-footer" style={{ gap: "40px", marginBottom: "48px" }}>
          {/* Brand */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "var(--font-display)",
                fontSize: "18px",
                fontWeight: 800,
                color: "#fff",
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--accent)",
                  display: "inline-block",
                }}
              />
              {siteConfig.companyName}
            </div>
            <p style={{ fontSize: "13px", lineHeight: 1.8, maxWidth: "260px", marginBottom: "20px" }}>
              Premium exterior cleaning for homes and commercial properties across Cape Town and the Western Cape.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              {siteConfig.socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    fontSize: "12px",
                    fontWeight: 600,
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {s.name === "Facebook" ? <FacebookIcon /> : <InstagramIcon />}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                marginBottom: "14px",
              }}
            >
              Services
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {services.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                marginBottom: "14px",
              }}
            >
              Company
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {company.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                marginBottom: "14px",
              }}
            >
              Contact
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <a
                href={siteConfig.phoneHref}
                style={{ fontSize: "13px", color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}
              >
                {siteConfig.phoneDisplay}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}
              >
                {siteConfig.email}
              </a>
              <span style={{ fontSize: "13px" }}>Cape Town, Western Cape</span>
              <span style={{ fontSize: "13px" }}>{siteConfig.hoursText}</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            fontSize: "12px",
          }}
        >
          <span>
            © {new Date().getFullYear()}{" "}
            <span style={{ color: "var(--accent)" }}>{siteConfig.companyName}</span>. All rights reserved.
          </span>
          <span style={{ color: "rgba(255,255,255,0.35)" }}>
            Designed for Cape Town&apos;s finest properties.
          </span>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { siteConfig } from "@/config/site";

const services = [
  { href: "/services#roof", label: "Roof Cleaning" },
  { href: "/services#driveway", label: "Driveway & Paving" },
  { href: "/services#walls", label: "Walls & Facades" },
  { href: "/services#commercial", label: "Commercial" },
  { href: "/services#windows", label: "Windows & Solar" },
];
const company = [
  { href: "/about", label: "About Us" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
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
          className="ui-container"
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
              Get an instant quote using our map-based tool — takes under 2 minutes.
            </p>
          </div>
          <Link href="/quote" className="ui-btn ui-btn-primary">
            Get Instant Quote →
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="ui-container" style={{ padding: "56px 24px 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "40px",
            marginBottom: "48px",
          }}
        >
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
                  {s.shortLabel}
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
                href="mailto:hello@aquatechcleaning.co.za"
                style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}
              >
                hello@aquatechcleaning.co.za
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

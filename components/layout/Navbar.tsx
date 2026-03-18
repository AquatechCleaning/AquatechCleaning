"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { siteConfig } from "@/config/site";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Top bar */}
      <div
        style={{
          background: "var(--navy)",
          padding: "6px 0",
          fontSize: "12px",
          color: "rgba(255,255,255,0.65)",
        }}
      >
        <div
          className="ui-container"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <a href={siteConfig.phoneHref} style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
              📞 {siteConfig.phoneDisplay}
            </a>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>|</span>
            <a href="mailto:hello@aquatechcleaning.co.za" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>
              hello@aquatechcleaning.co.za
            </a>
          </div>
          <div style={{ color: "rgba(255,255,255,0.5)" }}>⏰ {siteConfig.hoursText}</div>
        </div>
      </div>

      {/* Main nav */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: scrolled ? "rgba(255,255,255,0.97)" : "#fff",
          borderBottom: "1px solid var(--border)",
          backdropFilter: scrolled ? "blur(8px)" : "none",
          boxShadow: scrolled ? "var(--shadow-md)" : "none",
          transition: "all 250ms ease",
        }}
      >
        <div
          className="ui-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
              fontFamily: "var(--font-display)",
              fontSize: "18px",
              fontWeight: 800,
              color: "var(--navy)",
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
          </Link>

          {/* Desktop links */}
          <nav style={{ display: "flex", gap: "4px", alignItems: "center" }} className="hidden-mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontSize: "13.5px",
                  fontWeight: pathname === link.href ? 600 : 500,
                  color: pathname === link.href ? "var(--navy)" : "var(--text-muted)",
                  background: pathname === link.href ? "var(--bg)" : "transparent",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Link href="/quote" className="ui-btn ui-btn-primary">
              Get a Quote →
            </Link>
            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(!open)}
              style={{
                display: "none",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "4px",
              }}
              className="show-mobile"
              aria-label="Toggle menu"
            >
              <div style={{ width: "22px", height: "2px", background: "var(--navy)", marginBottom: "5px", transition: "all 200ms" }} />
              <div style={{ width: "22px", height: "2px", background: "var(--navy)", marginBottom: "5px" }} />
              <div style={{ width: "22px", height: "2px", background: "var(--navy)" }} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div
            style={{
              borderTop: "1px solid var(--border)",
              background: "#fff",
              padding: "12px 24px 20px",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  padding: "10px 0",
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "var(--navy)",
                  textDecoration: "none",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: block !important; }
        }
        @media (min-width: 769px) {
          .show-mobile   { display: none !important; }
        }
      `}</style>
    </>
  );
}

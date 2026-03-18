"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const MIN_SCALE = 1;
const MAX_SCALE = 1.4;

export function HeroBanner() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [scale, setScale] = useState(MIN_SCALE);
  const [isPrimaryHover, setIsPrimaryHover] = useState(false);
  const [isSecondaryHover, setIsSecondaryHover] = useState(false);

  useEffect(() => {
    let rafId = 0;

    const updateScale = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;
      const sectionCenter = rect.top + rect.height / 2;
      const maxDistance = viewportHeight / 2 + rect.height / 2;
      const distance = Math.abs(sectionCenter - viewportCenter);
      const progress = Math.max(0, 1 - distance / maxDistance);
      const nextScale = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * progress;

      setScale((prev) => (Math.abs(prev - nextScale) > 0.001 ? nextScale : prev));
    };

    const onScrollOrResize = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        updateScale();
        rafId = 0;
      });
    };

    updateScale();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  return (
    <section className="banner-section" ref={sectionRef}>
      <div className="banner-carousel owl-theme owl-carousel" style={{ display: "block" }}>
        <div className="slide-item active" style={{ position: "relative", minHeight: "780px", display: "block" }}>
          <div
            className="image-layer"
            style={{
              backgroundImage: "url(/Logo.png)",
              position: "absolute",
              inset: 0,
              zIndex: 0,
              pointerEvents: "none",
              backgroundSize: "50% calc(50% + 124px)",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "calc(50% + 240px) center",
              transform: `scale(${scale})`,
              transformOrigin: "center center",
              transition: "transform 120ms linear",
              animation: "none",
              willChange: "transform",
            }}
          />
          <div className="auto-container">
            <div className="row" style={{ position: "relative", zIndex: 10, paddingTop: "180px", paddingBottom: "120px", pointerEvents: "auto" }}>
              <div className="col-lg-7">
                <div className="banner-wrapper">
                  <div className="content-box" style={{ opacity: 1, visibility: "visible" }}>
                    <h3 style={{ opacity: 1, transform: "none", visibility: "visible", paddingLeft: 0, marginLeft: 0, textAlign: "left" }}>
                      Cape Town&apos;s Trusted Exterior Cleaning Experts
                    </h3>
                    <h2 style={{ opacity: 1, transform: "none", visibility: "visible" }}>For Homes & Businesses</h2>
                    <p style={{ opacity: 1, transform: "none", visibility: "visible", textAlign: "justify", maxWidth: "calc(100% - 170px)", fontSize: "18px" }}>
                      We specialise in safe, high-pressure and soft-wash cleaning for roofs, driveways, walls, windows, solar panels, and commercial properties, delivering powerful results without harming your surfaces.
                    </p>
                    <p style={{ opacity: 1, transform: "none", visibility: "visible", textAlign: "justify", maxWidth: "calc(100% - 170px)", fontSize: "18px" }}>
                      Reliable. Professional. Spotless, every time.
                    </p>
                    <div className="btn-box" style={{ opacity: 1, transform: "none", visibility: "visible" }}>
                      <button
                        type="button"
                        className="hero-cta hero-cta-primary"
                        onClick={() => router.push("/services")}
                        onMouseEnter={() => setIsPrimaryHover(true)}
                        onMouseLeave={() => setIsPrimaryHover(false)}
                        style={{
                          background: isPrimaryHover ? "transparent" : "#FF9F0D",
                          border: "2px solid #FF9F0D",
                          color: isPrimaryHover ? "#FFFFFF" : "#080C24",
                          borderRadius: "50px",
                          padding: "15px 42px",
                          fontSize: "18px",
                          fontWeight: 500,
                          lineHeight: "27px",
                          transition: "0.3s",
                          cursor: "pointer",
                        }}
                      >
                        <span>Discover More</span>
                      </button>
                      <button
                        type="button"
                        className="hero-cta hero-cta-secondary"
                        onClick={() => router.push("/quote")}
                        onMouseEnter={() => setIsSecondaryHover(true)}
                        onMouseLeave={() => setIsSecondaryHover(false)}
                        style={{
                          background: isSecondaryHover ? "transparent" : "#FFFFFF",
                          border: "2px solid #FF9F0D",
                          color: isSecondaryHover ? "#FFFFFF" : "#080C24",
                          borderRadius: "50px",
                          padding: "15px 48px",
                          fontSize: "18px",
                          fontWeight: 500,
                          lineHeight: "27px",
                          transition: "0.3s",
                          cursor: "pointer",
                        }}
                      >
                        <span>Create Quote</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

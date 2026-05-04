"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";

const CONSENT_KEY = "aquatech_cookie_consent";
const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || "9518355421594109";
const ga4MeasurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

type ConsentChoice = "accepted" | "declined";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const trackPageView = (attempt = 0) => {
  if (typeof window.fbq === "function") {
    window.fbq("track", "PageView");
    return;
  }

  if (attempt < 10) {
    window.setTimeout(() => trackPageView(attempt + 1), 250);
  }
};

const trackGa4PageView = (attempt = 0) => {
  if (!ga4MeasurementId) return;

  if (typeof window.gtag === "function") {
    window.gtag("event", "page_view", {
      page_location: window.location.href,
      page_path: window.location.pathname + window.location.search,
      page_title: document.title,
    });
    return;
  }

  if (attempt < 10) {
    window.setTimeout(() => trackGa4PageView(attempt + 1), 250);
  }
};

export const hasAdvertisingConsent = () => {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(CONSENT_KEY) === "accepted";
};

export function CookieConsent() {
  const pathname = usePathname();
  const [choice, setChoice] = useState<ConsentChoice | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const stored = window.localStorage.getItem(CONSENT_KEY);
      if (stored === "accepted" || stored === "declined") {
        setChoice(stored);
      }
      setReady(true);
    });
  }, []);

  const saveChoice = (nextChoice: ConsentChoice) => {
    window.localStorage.setItem(CONSENT_KEY, nextChoice);
    setChoice(nextChoice);

    if (nextChoice === "accepted") {
      trackPageView();
    }
  };

  const shouldLoadMeta = choice === "accepted";
  const shouldLoadGa4 = choice === "accepted" && Boolean(ga4MeasurementId);
  const shouldShowBanner = ready && choice === null;

  useEffect(() => {
    if (choice !== "accepted") return;
    if (pathname?.startsWith("/admin")) return;

    trackGa4PageView();
  }, [choice, pathname]);

  return (
    <>
      {shouldLoadMeta && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {shouldLoadGa4 && (
        <>
          <Script
            id="ga4-loader"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-config" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${ga4MeasurementId}', { send_page_view: false });
            `}
          </Script>
        </>
      )}

      {shouldShowBanner && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Cookie notice"
          style={{
            position: "fixed",
            left: "16px",
            right: "16px",
            bottom: "16px",
            zIndex: 10000,
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: "min(720px, 100%)",
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              boxShadow: "0 18px 50px rgba(2, 32, 61, 0.18)",
              padding: "16px",
              pointerEvents: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "14px",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ flex: "1 1 320px" }}>
                <p
                  style={{
                    color: "var(--navy)",
                    fontFamily: "var(--font-display)",
                    fontSize: "15px",
                    fontWeight: 800,
                    marginBottom: "4px",
                  }}
                >
                  Cookies
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: 1.6 }}>
                  We use essential cookies for the quote tool and optional analytics and advertising tracking to
                  measure performance and improve retargeting. See our{" "}
                  <Link href="/privacy" style={{ color: "var(--primary)", fontWeight: 700 }}>
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px", flex: "0 1 auto", flexWrap: "wrap", justifyContent: "flex-end" }}>
                <button type="button" className="ui-btn ui-btn-ghost" onClick={() => saveChoice("declined")}>
                  Decline
                </button>
                <button type="button" className="ui-btn ui-btn-primary" onClick={() => saveChoice("accepted")}>
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Aquatech Cleaning",
  description: "How Aquatech Cleaning collects, uses, and protects your personal information in accordance with POPIA.",
};

const sections = [
  {
    number: "1",
    title: "Who We Are",
    content: (
      <>
        <p>
          Aquatech Cleaning (referred to as &ldquo;ATC&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is a professional exterior cleaning company based in Cape Town, South Africa, providing services across the Western Cape.
        </p>
        <p style={{ marginTop: "10px" }}>
          We are committed to protecting your personal information and processing it responsibly in accordance with the <strong>Protection of Personal Information Act, 4 of 2013 (POPIA)</strong> and all applicable South African privacy legislation.
        </p>
        <p style={{ marginTop: "10px" }}>
          For any privacy-related enquiries, contact us at:{" "}
          <a href="mailto:aston@aquatechcleaning.co.za" style={{ color: "var(--primary)" }}>
            aston@aquatechcleaning.co.za
          </a>
        </p>
      </>
    ),
  },
  {
    number: "2",
    title: "What Information We Collect",
    content: (
      <>
        <p>We collect personal information when you interact with our website or request our services. This includes:</p>
        <div style={{ marginTop: "12px", display: "flex", flexDirection: "column" as const, gap: "8px" }}>
          {[
            { label: "Identity information", detail: "Full name and surname" },
            { label: "Contact details", detail: "Phone number and email address" },
            { label: "Property information", detail: "Physical address and GPS coordinates of the property to be serviced" },
            { label: "Measurement data", detail: "Surface area measurements drawn or entered through our online quote tool" },
            { label: "Service preferences", detail: "Types of cleaning services requested and any special instructions or notes" },
            { label: "Communications", detail: "Messages submitted via our contact form or email correspondence" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                gap: "10px",
                padding: "10px 14px",
                background: "var(--bg)",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            >
              <span style={{ color: "var(--accent)", fontWeight: 700, flexShrink: 0 }}>→</span>
              <span>
                <strong style={{ color: "var(--navy)" }}>{item.label}:</strong>{" "}
                <span style={{ color: "#334155" }}>{item.detail}</span>
              </span>
            </div>
          ))}
        </div>
        <p style={{ marginTop: "12px", fontSize: "14px", color: "var(--text-muted)" }}>
          We do not collect sensitive personal information such as identity numbers, financial account details, or biometric data.
        </p>
      </>
    ),
  },
  {
    number: "3",
    title: "Why We Collect Your Information",
    content: (
      <>
        <p>We collect and process your personal information only for the following lawful purposes:</p>
        <div style={{ marginTop: "12px", display: "flex", flexDirection: "column" as const, gap: "6px" }}>
          {[
            "To generate and send you an accurate cleaning quotation",
            "To schedule, confirm, and manage your cleaning appointment",
            "To communicate with you before, during, and after service delivery",
            "To process invoices and follow up on payments",
            "To improve our services based on job history and feedback",
            "To comply with legal or regulatory obligations",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", fontSize: "14px", color: "#334155", lineHeight: 1.75 }}>
              <span style={{ color: "var(--primary)", fontWeight: 700, flexShrink: 0 }}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
        <p style={{ marginTop: "12px", fontSize: "14px", color: "#334155", lineHeight: 1.75 }}>
          We will not process your information for any purpose other than those listed above without obtaining your prior consent.
        </p>
      </>
    ),
  },
  {
    number: "4",
    title: "How We Store and Protect Your Information",
    content: (
      <>
        <p>
          Your information is stored in a secure, password-protected database. We implement industry-standard security measures including encrypted data transmission (HTTPS), access controls, and restricted staff access to protect your personal information against unauthorised access, loss, or misuse.
        </p>
        <p style={{ marginTop: "10px" }}>
          We retain your information for as long as is necessary to fulfil the purposes outlined in this policy, or as required by law. Once your information is no longer needed, it will be securely deleted or anonymised.
        </p>
      </>
    ),
  },
  {
    number: "5",
    title: "Third-Party Services We Use",
    content: (
      <>
        <p>
          To deliver our services and operate our website, we use the following third-party platforms that may process your information on our behalf:
        </p>
        <div style={{ marginTop: "12px", display: "flex", flexDirection: "column" as const, gap: "8px" }}>
          {[
            {
              name: "Google Maps & Places API",
              detail: "Used to allow you to search and pin your property address on our quoting tool. Google may process your address search queries in accordance with Google's Privacy Policy.",
            },
            {
              name: "Google Forms & Google Sheets",
              detail: "Your contact form submissions are forwarded to a secure Google Sheet used internally by our team for scheduling and follow-up. This data is not shared with any other parties.",
            },
            {
              name: "Email service providers",
              detail: "Used to send you quotations, confirmations, and follow-up communications. Emails are only sent in response to your enquiry or service booking.",
            },
          ].map((item) => (
            <div key={item.name} style={{ padding: "14px 16px", background: "var(--bg)", borderRadius: "10px" }}>
              <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--navy)", marginBottom: "4px" }}>{item.name}</p>
              <p style={{ fontSize: "13px", color: "#334155", lineHeight: 1.7 }}>{item.detail}</p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: "12px", fontSize: "14px", color: "#334155", lineHeight: 1.75 }}>
          We do not sell, rent, or trade your personal information to any third party for marketing purposes.
        </p>
      </>
    ),
  },
  {
    number: "6",
    title: "Photography and Marketing",
    content: (
      <>
        <p>
          As outlined in our Terms &amp; Conditions, by accepting a quotation you grant Aquatech Cleaning permission to photograph and film work areas before, during, and after cleaning. This content may be used for marketing on platforms including Facebook, Instagram, YouTube, and TikTok.
        </p>
        <p style={{ marginTop: "10px" }}>
          We will never use images that identify you personally, your family members, or any private possessions without your explicit consent. No personal information (such as your name or address) will appear in any published content.
        </p>
        <p style={{ marginTop: "10px" }}>
          You may request in writing that no photography or filming take place on your property, and we will honour that request.
        </p>
      </>
    ),
  },
  {
    number: "7",
    title: "Cookies and Website Tracking",
    content: (
      <>
        <p>
          Our website uses Google Maps, which may set cookies or collect usage data when you interact with the map tool. We do not use any additional analytics, advertising, or tracking cookies beyond what is required to operate the map and quoting features.
        </p>
        <p style={{ marginTop: "10px" }}>
          You can control cookie settings through your browser preferences. Disabling cookies may affect the functionality of our online quote tool.
        </p>
      </>
    ),
  },
  {
    number: "8",
    title: "Your Rights Under POPIA",
    content: (
      <>
        <p>Under the Protection of Personal Information Act (POPIA), you have the right to:</p>
        <div style={{ marginTop: "12px", display: "flex", flexDirection: "column" as const, gap: "6px" }}>
          {[
            "Request access to the personal information we hold about you",
            "Request correction of inaccurate or incomplete information",
            "Request deletion of your personal information, subject to our legal obligations",
            "Object to the processing of your information",
            "Withdraw consent at any time where processing is based on consent",
            "Lodge a complaint with the Information Regulator of South Africa",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", fontSize: "14px", color: "#334155", lineHeight: 1.75 }}>
              <span style={{ color: "var(--primary)", fontWeight: 700, flexShrink: 0 }}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
        <p style={{ marginTop: "12px", fontSize: "14px", color: "#334155", lineHeight: 1.75 }}>
          To exercise any of these rights, please contact us at{" "}
          <a href="mailto:aston@aquatechcleaning.co.za" style={{ color: "var(--primary)" }}>
            aston@aquatechcleaning.co.za
          </a>
          . We will respond within 30 days of receiving your request.
        </p>
      </>
    ),
  },
  {
    number: "9",
    title: "Information Regulator",
    content: (
      <p>
        If you believe your personal information has been mishandled and we have not resolved your concern satisfactorily, you have the right to lodge a complaint with the <strong>Information Regulator of South Africa</strong>:
        <br /><br />
        Website: <a href="https://www.justice.gov.za/inforeg/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>www.justice.gov.za/inforeg</a><br />
        Email: inforeg@justice.gov.za<br />
        Tel: 010 023 5207
      </p>
    ),
  },
  {
    number: "10",
    title: "Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time to reflect changes in our operations or legal obligations. The most current version will always be available on this page. We encourage you to review it periodically. Continued use of our website or services after any update constitutes acceptance of the revised policy.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <div
        className="page-hero"
        style={{ background: "var(--navy)", padding: "64px 0 80px", position: "relative", overflow: "hidden" }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
            pointerEvents: "none",
          }}
        />
        <div className="ui-container" style={{ position: "relative" }}>
          <p className="ui-kicker reveal-up" style={{ color: "var(--accent)" }}>
            Legal
          </p>
          <h1 className="ui-title reveal-up reveal-up-d1" style={{ color: "#fff", marginTop: "8px" }}>
            Privacy Policy
          </h1>
          <p
            className="ui-subtitle reveal-up reveal-up-d2"
            style={{ color: "rgba(255,255,255,0.65)", marginTop: "10px", maxWidth: "520px" }}
          >
            How we collect, use, and protect your personal information. Last updated April 2026.
          </p>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40px",
            background: "var(--bg)",
            clipPath: "ellipse(60% 100% at 50% 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="ui-container pg-body" style={{ padding: "60px 24px" }}>
        <div style={{ maxWidth: "760px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {sections.map((section) => (
            <div
              key={section.number}
              className="ui-card reveal-up"
              style={{ padding: "28px 32px" }}
            >
              {/* Section heading */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
                <span
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "8px",
                    background: "var(--primary)",
                    color: "#fff",
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {section.number}
                </span>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "var(--navy)",
                  }}
                >
                  {section.title}
                </h2>
              </div>
              <div style={{ fontSize: "14px", color: "#334155", lineHeight: 1.8 }}>
                {section.content}
              </div>
            </div>
          ))}

          {/* Last updated note */}
          <p style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center", paddingBottom: "8px" }}>
            Aquatech Cleaning &mdash; Privacy Policy &mdash; Last updated April 2026 &mdash; Cape Town, South Africa
          </p>
        </div>
      </div>
    </div>
  );
}

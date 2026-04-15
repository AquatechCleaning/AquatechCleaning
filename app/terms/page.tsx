import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Aquatech Cleaning",
  description: "Terms and conditions for Aquatech Cleaning exterior cleaning services across Cape Town and the Western Cape.",
};

const sections = [
  {
    number: "1",
    title: "Services Provided",
    clauses: [
      "Aquatech Cleaning (hereafter referred to as ATC) agrees to provide exterior cleaning services as detailed in the accepted quotation.",
      "Services include, but are not limited to, roof, gutter, solar panel, window, wall, driveway, paving, and deck cleaning as outlined in the quotation.",
      "ATC reserves the right to refuse service if site conditions are deemed unsafe or unsuitable for work.",
    ],
  },
  {
    number: "2",
    title: "Payment and Add-Ons",
    clauses: [
      "The Customer agrees to pay ATC the full invoiced amount for all services rendered.",
      "Payment is due within two (2) business days of completion of the service unless otherwise agreed in writing.",
      "Should additional services be requested or required while ATC is on-site, an updated quotation (verbal or written) will be provided and must be approved by the customer before any additional work begins.",
      "The customer is responsible for ensuring that all movable objects are cleared from work areas prior to service (e.g., pot plants, chairs, tables, benches, carpets, decorations, etc.).",
      [
        "If items are not moved, ATC will charge R20 per item to move them (subject to the customer's prior consent).",
        "If consent is not given and the customer cannot move the items, ATC will clean around them and will not be held liable for any uncleaned areas or damages to said items.",
      ],
      "Interest of 2% per week may be charged on overdue invoices.",
      "Invoices not paid within 14 days may be handed over for collection, and the customer will be liable for all collection and legal costs incurred.",
    ],
  },
  {
    number: "3",
    title: "Cancellation and Rescheduling",
    clauses: [
      [
        "Cancellations must be made at least 24 hours in advance of the scheduled appointment.",
        "Failure to provide 24 hours' notice may incur a cancellation fee at ATC's discretion.",
      ],
      "Cancellations due to severe weather or safety concerns will be rescheduled by mutual agreement at no additional cost.",
      "ATC reserves the right to reschedule services in the event of unforeseen circumstances such as adverse weather, equipment failure, or staff unavailability.",
    ],
  },
  {
    number: "4",
    title: "Liability",
    clauses: [
      "ATC is not liable for damages arising from failure to follow post-service care instructions provided to the customer.",
      "ATC is not responsible for pre-existing damages in serviced areas or nearby structures.",
      "ATC will not be held responsible for damages caused by, but not limited to, defective or improperly installed materials such as tiles, roof sheeting, windows, doors, gutters, wiring, caulking, or siding.",
      "In certain materials such as aluminum or vinyl siding, color fading or chalking may become more apparent after cleaning due to sun exposure and age; ATC is not liable for these aesthetic effects.",
      "ATC will endeavour to inform the client of any visible or potential surface damage identified before or during the service.",
      "ATC shall not be liable for any indirect, incidental, or consequential losses (including loss of income, profit, or use) arising from services rendered.",
      "The customer agrees that ATC's total liability, if any, shall not exceed the total amount paid for the specific service giving rise to the claim.",
    ],
  },
  {
    number: "5",
    title: "Water and Electrical Usage",
    clauses: [
      "The customer agrees to provide ATC access to on-site water supply sufficient to perform the work. If unavailable, off-site water must be arranged and will incur an additional charge.",
      "The customer agrees to provide ATC access to on-site electricity if required for certain equipment. If unavailable, external power sources will be used at an additional cost.",
      "It is the customer's responsibility to ensure that outdoor taps, fittings, and electrical outlets are in working order before work begins.",
      "Additional costs for externally supplied water or electricity will be quoted in advance.",
    ],
  },
  {
    number: "6",
    title: "Customer Safety",
    clauses: [
      "For safety reasons, all family members, children, and pets must remain away from work areas during the cleaning process and for at least 12 hours after completion, unless otherwise advised by ATC.",
      "The customer must notify ATC in advance of any safety hazards on the property (e.g., aggressive animals, uneven ground, or electrical issues).",
    ],
  },
  {
    number: "7",
    title: "Filming and Photography",
    clauses: [
      "By accepting the quotation, the customer grants ATC permission to take photos and videos of the work areas before, during, and after cleaning.",
      "This content may be used for marketing purposes on platforms including but not limited to Facebook, Instagram, YouTube, and TikTok.",
      "ATC will ensure that no personal information or identifying images of customers or their family members are used without explicit consent.",
      "Customers may request, in writing, that no photography or filming occur on their property.",
    ],
  },
  {
    number: "8",
    title: "Confidentiality",
    clauses: [
      "ATC agrees to keep all customer-related information confidential and will not disclose such information to any third party except as required by law or for operational purposes (e.g., invoicing, scheduling).",
    ],
  },
  {
    number: "9",
    title: "Warranty and Service Guarantee",
    clauses: [
      "ATC strives to deliver the highest quality workmanship.",
      "If the customer is dissatisfied with any aspect of the service, they must notify ATC within 48 hours of completion for an inspection and potential rectification.",
      "This warranty does not apply to natural regrowth, weather conditions, or surfaces affected by pre-existing wear or defects.",
    ],
  },
  {
    number: "10",
    title: "Force Majeure",
    clauses: [
      "ATC shall not be held liable for delays or non-performance resulting from circumstances beyond its reasonable control, including but not limited to: weather, fire, flood, strike, pandemic, or equipment failure.",
    ],
  },
];

export default function TermsPage() {
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
            Terms &amp; Conditions
          </h1>
          <p
            className="ui-subtitle reveal-up reveal-up-d2"
            style={{ color: "rgba(255,255,255,0.65)", marginTop: "10px", maxWidth: "520px" }}
          >
            By accepting any quotation from Aquatech Cleaning, you agree to the following terms and conditions.
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "18px",
                }}
              >
                <span
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "8px",
                    background: "var(--accent)",
                    color: "var(--navy)",
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

              {/* Clauses */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {section.clauses.map((clause, ci) => {
                  if (Array.isArray(clause)) {
                    return (
                      <div
                        key={ci}
                        style={{
                          marginLeft: "16px",
                          paddingLeft: "16px",
                          borderLeft: "2px solid var(--border)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        {clause.map((sub, si) => (
                          <p
                            key={si}
                            style={{ fontSize: "14px", color: "#334155", lineHeight: 1.75 }}
                          >
                            {sub}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return (
                    <p key={ci} style={{ fontSize: "14px", color: "#334155", lineHeight: 1.75 }}>
                      {clause}
                    </p>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Acceptance notice */}
          <div
            className="ui-card reveal-up"
            style={{
              padding: "24px 32px",
              background: "var(--navy)",
              border: "none",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "15px",
                fontWeight: 700,
                color: "#fff",
                marginBottom: "8px",
              }}
            >
              Acceptance
            </p>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", lineHeight: 1.75 }}>
              By accepting the quotation, the customer acknowledges and agrees to all the above Terms and Conditions of Aquatech Cleaning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div style={{ background: "var(--bg)" }}>
      <div style={{ background: "var(--navy)", padding: "64px 0 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div className="ui-container" style={{ position: "relative" }}>
          <p className="ui-kicker reveal-up" style={{ color: "var(--accent)" }}>Legal</p>
          <h1 className="ui-title reveal-up reveal-up-d1" style={{ color: "#fff", marginTop: "8px" }}>Privacy Policy</h1>
          <p className="ui-subtitle reveal-up reveal-up-d2" style={{ color: "rgba(255,255,255,0.65)", marginTop: "10px", maxWidth: "480px" }}>
            How we collect and use your information.
          </p>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40px", background: "var(--bg)", clipPath: "ellipse(60% 100% at 50% 100%)" }} />
      </div>

      <div className="ui-container" style={{ padding: "60px 24px" }}>
        <div className="ui-card reveal-up" style={{ padding: "40px", maxWidth: "720px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {[
              {
                title: "What we collect",
                body: "We collect contact details (name, email, phone), property addresses, and measurement information submitted via our quote tool. This information is used solely to provide quotes and schedule cleaning work.",
              },
              {
                title: "How we use your data",
                body: "Your data is used to generate and send quotes, schedule jobs, and follow up after completed work. We do not sell, rent, or share your personal information with third parties for marketing purposes.",
              },
              {
                title: "Data security",
                body: "All data is stored securely in an encrypted database. We use industry-standard security practices to protect your information from unauthorised access.",
              },
              {
                title: "Your rights",
                body: "You may request removal of your personal data at any time by emailing hello@aquatechcleaning.co.za. We will process your request within 30 days.",
              },
              {
                title: "Contact",
                body: "For any privacy-related questions, please contact us at hello@aquatechcleaning.co.za.",
              },
            ].map((section) => (
              <div key={section.title}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 700, color: "var(--navy)", marginBottom: "8px" }}>
                  {section.title}
                </h2>
                <p style={{ fontSize: "14px", color: "#334155", lineHeight: 1.8 }}>{section.body}</p>
              </div>
            ))}
            <div
              style={{
                padding: "14px 16px",
                background: "#FEF9C3",
                border: "1px solid #FDE68A",
                borderRadius: "10px",
                fontSize: "12px",
                color: "#92400e",
              }}
            >
              This is a placeholder privacy policy. Replace with your full legal copy before going live.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

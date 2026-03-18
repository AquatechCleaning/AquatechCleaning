import { siteConfig } from "@/config/site";

export function TopBar() {
  return (
    <div
      style={{
        background: "var(--navy)",
        padding: "7px 0",
        fontSize: "12px",
        color: "rgba(255,255,255,0.6)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="ui-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <a
            href={siteConfig.phoneHref}
            style={{
              color: "var(--accent)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            📞 {siteConfig.phoneDisplay}
          </a>
          <span style={{ color: "rgba(255,255,255,0.25)" }}>|</span>
          <a
            href="mailto:hello@aquatechcleaning.co.za"
            style={{ color: "rgba(255,255,255,0.65)", textDecoration: "none" }}
          >
            ✉ hello@aquatechcleaning.co.za
          </a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span>⏰ {siteConfig.hoursText}</span>
          <div style={{ display: "flex", gap: "8px" }}>
            {siteConfig.socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                aria-label={s.name}
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,255,255,0.65)",
                  fontSize: "10px",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                {s.shortLabel}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

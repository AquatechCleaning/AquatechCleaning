import Link from "next/link";

export function PageHeader({
  title,
  subtitle,
  breadcrumb,
}: {
  title: string;
  subtitle?: string;
  breadcrumb?: Array<{ label: string; href?: string }>;
}) {
  return (
    <div
      style={{
        background: "var(--navy)",
        padding: "56px 0 72px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* grid texture */}
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
        {/* Breadcrumb */}
        {breadcrumb && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "12px",
              fontSize: "12px",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            {breadcrumb.map((item, i) => (
              <span key={`${item.label}-${i}`} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {item.href ? (
                  <Link href={item.href} style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
                    {item.label}
                  </Link>
                ) : (
                  <span style={{ color: "var(--accent)" }}>{item.label}</span>
                )}
                {i < breadcrumb.length - 1 && (
                  <span style={{ color: "rgba(255,255,255,0.25)" }}>›</span>
                )}
              </span>
            ))}
          </div>
        )}

        <h1
          className="ui-title reveal-up"
          style={{ color: "#fff", marginBottom: subtitle ? "12px" : 0 }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className="ui-subtitle reveal-up reveal-up-d1"
            style={{ color: "rgba(255,255,255,0.65)", maxWidth: "520px" }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* wave */}
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
  );
}

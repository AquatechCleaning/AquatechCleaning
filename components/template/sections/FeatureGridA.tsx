import Link from "next/link";

export function FeatureGridA({
  title,
  items,
}: {
  title: string;
  items: Array<{ title: string; description: string; image: string }>;
}) {
  return (
    <section style={{ background: "var(--bg)", padding: "80px 0" }}>
      <div className="ui-container">
        <div className="ui-section-header reveal-up">
          <p className="ui-kicker">Features</p>
          <h2 className="ui-title" style={{ marginTop: "8px" }}>{title}</h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {items.map((item, i) => (
            <div
              key={item.title}
              className={`ui-card ui-card-hover reveal-up reveal-up-d${Math.min(i + 1, 4)}`}
              style={{ overflow: "hidden" }}
            >
              {item.image && (
                <div style={{ height: "180px", overflow: "hidden" }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 400ms ease" }}
                  />
                </div>
              )}
              <div style={{ padding: "20px 22px" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "var(--navy)",
                    marginBottom: "8px",
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7 }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

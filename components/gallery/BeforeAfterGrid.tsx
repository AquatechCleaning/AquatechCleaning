type MediaItem = {
  _id: string;
  title: string;
  locationLabel?: string;
  serviceType?: string;
  imageBeforeUrl: string;
  imageAfterUrl: string;
};

async function getMedia(): Promise<MediaItem[]> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";
  try {
    const res = await fetch(new URL("/api/media", base).toString(), {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function BeforeAfterGrid() {
  const media = await getMedia();

  if (media.length === 0) {
    return (
      <div className="ui-container" style={{ padding: "60px 24px" }}>
        <div
          className="ui-card"
          style={{ padding: "60px", textAlign: "center" }}
        >
          <p style={{ fontSize: "40px", marginBottom: "16px" }}>📸</p>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "17px",
              fontWeight: 700,
              color: "var(--navy)",
              marginBottom: "8px",
            }}
          >
            Gallery coming soon
          </p>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Upload before/after media in the admin panel to populate this gallery.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ui-container" style={{ padding: "60px 24px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        {media.map((item, i) => (
          <div
            key={item._id}
            className={`ui-card ui-card-hover reveal-up reveal-up-d${Math.min(i + 1, 4)}`}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                position: "relative",
              }}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={item.imageBeforeUrl}
                  alt="Before"
                  style={{ height: "200px", width: "100%", objectFit: "cover" }}
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    left: "8px",
                    background: "rgba(0,0,0,0.6)",
                    color: "#fff",
                    fontSize: "9px",
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: "100px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Before
                </span>
              </div>
              <div style={{ position: "relative" }}>
                <img
                  src={item.imageAfterUrl}
                  alt="After"
                  style={{ height: "200px", width: "100%", objectFit: "cover" }}
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    right: "8px",
                    background: "var(--accent)",
                    color: "var(--navy)",
                    fontSize: "9px",
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: "100px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  After
                </span>
              </div>
            </div>
            <div style={{ padding: "14px 18px" }}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--navy)",
                  marginBottom: "6px",
                }}
              >
                {item.title}
              </p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {item.serviceType && (
                  <span
                    style={{
                      fontSize: "10px",
                      background: "#EFF6FF",
                      color: "var(--primary)",
                      padding: "2px 8px",
                      borderRadius: "100px",
                      fontWeight: 600,
                      textTransform: "capitalize",
                    }}
                  >
                    {item.serviceType.replace("_", " ")}
                  </span>
                )}
                {item.locationLabel && (
                  <span
                    style={{
                      fontSize: "10px",
                      background: "var(--surface-2)",
                      color: "var(--text-muted)",
                      padding: "2px 8px",
                      borderRadius: "100px",
                      fontWeight: 600,
                    }}
                  >
                    📍 {item.locationLabel}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

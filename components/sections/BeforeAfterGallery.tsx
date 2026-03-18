type MediaItem = { _id: string; title: string; locationLabel?: string; imageBeforeUrl: string; imageAfterUrl: string };

export function BeforeAfterGallery({ media }: { media: MediaItem[] }) {
  if (media.length === 0) return null;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
      {media.map((item) => (
        <div key={item._id} className="ui-card ui-card-hover" style={{ overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", position: "relative" }}>
            <img src={item.imageBeforeUrl} alt="Before" style={{ height: "180px", width: "100%", objectFit: "cover" }} />
            <img src={item.imageAfterUrl}  alt="After"  style={{ height: "180px", width: "100%", objectFit: "cover" }} />
            <div
              style={{
                position: "absolute",
                top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                background: "var(--accent)",
                color: "var(--navy)",
                fontSize: "9px",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "4px 8px",
                borderRadius: "100px",
                whiteSpace: "nowrap",
              }}
            >
              Before / After
            </div>
          </div>
          <div style={{ padding: "14px 16px" }}>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--navy)" }}>{item.title}</p>
            {item.locationLabel && (
              <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{item.locationLabel}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

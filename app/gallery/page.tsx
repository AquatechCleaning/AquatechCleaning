import { MissionBeforeAfter } from "@/components/home/MissionBeforeAfter";

type MediaItem = { _id: string; title: string; locationLabel?: string; serviceType?: string; imageBeforeUrl: string; imageAfterUrl: string };

async function getMedia(): Promise<MediaItem[]> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    const res = await fetch(new URL("/api/media", base).toString(), { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error();
    return res.json();
  } catch { return []; }
}

export default async function GalleryPage() {
  const media = await getMedia();

  return (
    <div style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="page-hero" style={{ background: "var(--navy)", padding: "64px 0 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div className="ui-container" style={{ position: "relative" }}>
          <p className="ui-kicker reveal-up" style={{ color: "var(--accent)" }}>Our Portfolio</p>
          <h1 className="ui-title reveal-up reveal-up-d1" style={{ color: "#fff", marginTop: "8px", marginBottom: "12px" }}>
            Before &amp; After Gallery
          </h1>
          <p className="ui-subtitle reveal-up reveal-up-d2" style={{ color: "rgba(255,255,255,0.65)", maxWidth: "480px" }}>
            Real results from real properties across Cape Town and the Western Cape.
          </p>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40px", background: "var(--bg)", clipPath: "ellipse(60% 100% at 50% 100%)" }} />
      </div>

      <div className="ui-container pg-body" style={{ padding: "60px 24px" }}>
        {/* Interactive before/after demo */}
        <div className="ui-card reveal-up" style={{ padding: "32px", marginBottom: "40px" }}>
          <div className="rsp-grid-2" style={{ gap: "32px", alignItems: "center" }}>
            <div>
              <p className="ui-kicker">Interactive Demo</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 800, color: "var(--navy)", marginTop: "8px", marginBottom: "10px" }}>
                Drag to compare
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.7 }}>
                Move your cursor over the image to reveal the before and after result. This is what Aquatech does to every surface we touch.
              </p>
            </div>
            <div style={{ height: "280px", borderRadius: "14px", overflow: "hidden" }}>
              <MissionBeforeAfter />
            </div>
          </div>
        </div>

        {/* Media grid */}
        {media.length === 0 ? (
          <div className="ui-card" style={{ padding: "60px", textAlign: "center" }}>
            <p style={{ fontSize: "32px", marginBottom: "16px" }}>📸</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "17px", fontWeight: 700, color: "var(--navy)", marginBottom: "8px" }}>
              Gallery coming soon
            </p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              Upload before/after media in the admin panel to populate this gallery.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
            {media.map((item, i) => (
              <div key={item._id} className={`ui-card ui-card-hover reveal-up reveal-up-d${Math.min(i + 1, 4)}`} style={{ overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", position: "relative" }}>
                  <div style={{ position: "relative" }}>
                    <img src={item.imageBeforeUrl} alt="Before" style={{ height: "200px", width: "100%", objectFit: "cover" }} />
                    <span style={{ position: "absolute", bottom: "8px", left: "8px", background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "9px", fontWeight: 700, padding: "3px 8px", borderRadius: "100px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Before
                    </span>
                  </div>
                  <div style={{ position: "relative" }}>
                    <img src={item.imageAfterUrl} alt="After" style={{ height: "200px", width: "100%", objectFit: "cover" }} />
                    <span style={{ position: "absolute", bottom: "8px", right: "8px", background: "var(--accent)", color: "var(--navy)", fontSize: "9px", fontWeight: 700, padding: "3px 8px", borderRadius: "100px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      After
                    </span>
                  </div>
                </div>
                <div style={{ padding: "14px 18px" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: "var(--navy)" }}>{item.title}</p>
                  <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                    {item.serviceType && (
                      <span style={{ fontSize: "10px", background: "#EFF6FF", color: "var(--primary)", padding: "2px 8px", borderRadius: "100px", fontWeight: 600, textTransform: "capitalize" }}>
                        {item.serviceType.replace("_", " ")}
                      </span>
                    )}
                    {item.locationLabel && (
                      <span style={{ fontSize: "10px", background: "var(--surface-2)", color: "var(--text-muted)", padding: "2px 8px", borderRadius: "100px", fontWeight: 600 }}>
                        📍 {item.locationLabel}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

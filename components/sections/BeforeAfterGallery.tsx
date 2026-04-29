import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";

type MediaItem = { _id: string; title: string; locationLabel?: string; imageBeforeUrl: string; imageAfterUrl: string };

export function BeforeAfterGallery({ media }: { media: MediaItem[] }) {
  if (media.length === 0) return null;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
      {media.map((item) => (
        <div key={item._id} className="ui-card ui-card-hover" style={{ overflow: "hidden" }}>
          <BeforeAfterSlider beforeSrc={item.imageBeforeUrl} afterSrc={item.imageAfterUrl} height={180} borderRadius={0} />
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

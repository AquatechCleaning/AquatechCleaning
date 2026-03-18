import { GalleryHero } from "@/components/gallery/GalleryHero";
import { BeforeAfterGrid } from "@/components/gallery/BeforeAfterGrid";

export default function GalleryPage() {
  return (
    <section className="ui-shell bg-[#fbf8e5]">
      <GalleryHero />
      <BeforeAfterGrid />
    </section>
  );
}



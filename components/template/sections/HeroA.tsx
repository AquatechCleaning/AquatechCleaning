import { Container } from "@/components/template/Container";
import { Button } from "@/components/template/Button";

export function HeroA({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <section className="banner-section">
      <div className="banner-carousel owl-theme owl-carousel" style={{ display: "block" }}>
        <div className="slide-item active" style={{ minHeight: "520px", display: "block" }}>
          <div className="image-layer" style={{ backgroundImage: "url(/template/images/banner-01.jpg)" }} />
          <Container>
            <div className="row">
              <div className="col-lg-7">
                <div className="banner-wrapper">
                  <div className="content-box" style={{ opacity: 1, transform: "none" }}>
                    <h2 style={{ opacity: 1, transform: "none" }}>{title}</h2>
                    <p style={{ opacity: 1, transform: "none" }}>{subtitle}</p>
                    <div className="btn-box" style={{ opacity: 1, transform: "none" }}>
                      <Button href="/services">Discover More</Button>
                      <Button href="/quote" variant="secondary">
                        Create Quote
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}


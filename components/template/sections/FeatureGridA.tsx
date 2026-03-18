import { Container } from "@/components/template/Container";

export function FeatureGridA({
  title,
  items,
}: {
  title: string;
  items: Array<{ title: string; description: string; image: string }>;
}) {
  return (
    <section className="service">
      <Container>
        <div className="row">
          <div className="col-xl-12">
            <div className="common-title align-title">
              <span>Features</span>
              <h3>{title}</h3>
            </div>
          </div>
          {items.map((item) => (
            <div className="col-xl-4 col-lg-4" key={item.title}>
              <div className="service-container">
                <div className="service-content-wrapper">
                  <div className="service-content-wrapper-overlay" />
                  <div className="service-image">
                    <img src={item.image} alt={item.title} />
                  </div>
                </div>
                <div className="service-info">
                  <h5>{item.title}</h5>
                  <p>{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}


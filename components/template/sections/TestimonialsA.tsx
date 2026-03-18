import { Container } from "@/components/template/Container";

export function TestimonialsA({
  items,
}: {
  items: Array<{ name: string; role?: string; quote: string }>;
}) {
  return (
    <section className="testimonial">
      <Container>
        <div className="row">
          <div className="col-xl-12">
            <div className="common-title">
              <span>Testimonials</span>
              <h3>What People Are Saying</h3>
            </div>
          </div>
          <div className="col-xl-12">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <div className="testimonial-wrapper" key={item.name}>
                  <div className="testimonial-content">
                    <p>{item.quote}</p>
                    <div className="testimonial-info">
                      <ul>
                        <li>
                          <h6>{item.name}</h6>
                        </li>
                        {item.role ? (
                          <li>
                            <span>{item.role}</span>
                          </li>
                        ) : null}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}


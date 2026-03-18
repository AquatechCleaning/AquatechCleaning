import { Container } from "@/components/template/Container";

export function ProcessTimelineA({
  steps,
}: {
  steps: Array<{ title: string; text: string }>;
}) {
  return (
    <section className="service">
      <Container>
        <div className="row">
          <div className="col-xl-12">
            <div className="common-title align-title">
              <span>Process</span>
              <h3>How It Works</h3>
            </div>
          </div>
          {steps.map((step, idx) => (
            <div className="col-xl-3 col-lg-6 col-md-6" key={step.title}>
              <div className="service-container">
                <div className="service-info">
                  <h5>
                    {idx + 1}. {step.title}
                  </h5>
                  <p>{step.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}


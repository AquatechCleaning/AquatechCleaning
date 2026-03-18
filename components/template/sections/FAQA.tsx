import { Container } from "@/components/template/Container";

export function FAQA({
  items,
}: {
  items: Array<{ q: string; a: string }>;
}) {
  return (
    <section className="faq">
      <Container>
        <div className="row">
          <div className="col-xl-12">
            <div className="common-title">
              <span>FAQ</span>
              <h3>Frequently Asked Questions</h3>
            </div>
            <div className="accordion">
              {items.map((item, idx) => (
                <div className="accordion-item" key={item.q}>
                  <h2 className="accordion-header">
                    <button className="accordion-button" type="button">
                      {item.q}
                    </button>
                  </h2>
                  <div className={`accordion-collapse collapse ${idx === 0 ? "show" : ""}`}>
                    <div className="accordion-body">{item.a}</div>
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


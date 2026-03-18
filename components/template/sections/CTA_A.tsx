import { Container } from "@/components/template/Container";
import { Button } from "@/components/template/Button";

export function CTA_A({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <section className="video">
      <Container>
        <div className="row">
          <div className="col-xl-8">
            <div className="common-title vedio-title">
              <span>Watch More</span>
              <h3>{title}</h3>
              <p>{body}</p>
              <Button href="/quote">Create Quote</Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}


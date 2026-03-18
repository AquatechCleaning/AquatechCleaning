import { Container } from "@/components/template/Container";

export function StatsA({
  stats,
}: {
  stats: Array<{ label: string; value: string | number; iconClass?: string }>;
}) {
  return (
    <div className="counter-section">
      <Container>
        <div className="row counter-contrnt wow fadeInUp">
          {stats.map((item) => (
            <div className="col-xl-3 col-lg-3 col-md-6 d-flex justify-content-center align-items-center" key={item.label}>
              <div className="counter-content">
                {item.iconClass ? <i className={item.iconClass} /> : null}
                <h3 className="counter">{item.value}</h3>
                <span>{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}


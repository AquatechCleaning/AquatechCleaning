import Link from "next/link";

export function PageHeader({
  title,
  subtitle,
  breadcrumb,
}: {
  title: string;
  subtitle?: string;
  breadcrumb?: Array<{ label: string; href?: string }>;
}) {
  return (
    <div className="about-us-banner-content">
      <h2>{title}</h2>
      {breadcrumb ? (
        <div className="about-us-banner-wrapper">
          {breadcrumb.map((item, i) => (
            <span key={`${item.label}-${i}`}>
              {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
              {i < breadcrumb.length - 1 ? " . " : ""}
            </span>
          ))}
        </div>
      ) : null}
      {subtitle ? <p className="text-white/90">{subtitle}</p> : null}
    </div>
  );
}


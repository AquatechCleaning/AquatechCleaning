type Variant = "default" | "muted" | "contrast";

const variantStyle: Record<Variant, React.CSSProperties> = {
  default:  {},
  muted:    { background: "var(--bg)" },
  contrast: { background: "var(--navy)", color: "#fff" },
};

export function Section({
  children,
  className = "",
  variant = "default",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  style?: React.CSSProperties;
}) {
  return (
    <section
      className={className}
      style={{ ...variantStyle[variant], ...style }}
    >
      {children}
    </section>
  );
}

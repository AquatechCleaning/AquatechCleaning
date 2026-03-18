export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`appointment-container ${className}`.trim()}>{children}</div>;
}


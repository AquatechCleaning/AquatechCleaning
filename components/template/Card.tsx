export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`ui-card ${className}`.trim()}>{children}</div>
  );
}

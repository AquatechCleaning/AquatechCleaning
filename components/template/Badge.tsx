export function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`ui-badge ui-badge-sent ${className}`.trim()}
    >
      {children}
    </span>
  );
}

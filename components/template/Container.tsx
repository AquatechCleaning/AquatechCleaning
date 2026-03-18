export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`ui-container ${className}`.trim()}>{children}</div>
  );
}

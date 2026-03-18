export function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex rounded-full border border-[#d2d5c6] bg-[#fbf8e5] px-3 py-1 text-xs font-semibold text-[#055178] ${className}`.trim()}
    >
      {children}
    </span>
  );
}


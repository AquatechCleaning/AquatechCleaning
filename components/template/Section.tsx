type Variant = "default" | "muted" | "contrast";

const variantClass: Record<Variant, string> = {
  default: "",
  muted: "bg-[#fbf8e5]",
  contrast: "bg-[#02203D] text-white",
};

export function Section({
  children,
  className = "",
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
}) {
  return <section className={`${variantClass[variant]} ${className}`.trim()}>{children}</section>;
}


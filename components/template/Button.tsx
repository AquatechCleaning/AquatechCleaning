import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";

const variantClass: Record<Variant, string> = {
  primary:   "ui-btn ui-btn-primary",
  secondary: "ui-btn ui-btn-secondary",
  ghost:     "ui-btn ui-btn-ghost",
};

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
  type = "button",
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  href?: string;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const cls = `${variantClass[variant]} ${className}`.trim();

  if (href) {
    return <Link href={href} className={cls}>{children}</Link>;
  }

  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

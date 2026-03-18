import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost";

const classes: Record<ButtonVariant, string> = {
  primary: "btn-1",
  secondary: "btn-2",
  ghost: "common-btn",
};

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
  type = "button",
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  variant?: ButtonVariant;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}) {
  const classValue = `${classes[variant]} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classValue}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classValue} onClick={onClick}>
      {children}
    </button>
  );
}


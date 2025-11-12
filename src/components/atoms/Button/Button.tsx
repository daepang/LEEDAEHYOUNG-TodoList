import { getBaseStyle, variantStyles } from "./style";

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "default";
  children: React.ReactNode;
}

export function Button({
  onClick,
  disabled = false,
  variant = "default",
  children,
}: ButtonProps) {
  const baseStyle = getBaseStyle(disabled);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...baseStyle, ...variantStyles[variant] }}
    >
      {children}
    </button>
  );
}


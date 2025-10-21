import { colors } from "@/constants/color";

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
  const baseStyle = {
    padding: "8px 12px",
    borderRadius: 8,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
  };

  const variantStyles = {
    primary: {
      border: `1px solid ${colors.primary}`,
      background: colors.primary,
      color: colors.white,
    },
    default: {
      border: `1px solid ${colors.borderLight}`,
      background: colors.white,
      color: colors.textPrimary,
    },
  };

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

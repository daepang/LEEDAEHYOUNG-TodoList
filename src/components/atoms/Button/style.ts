import { colors } from "@/constants/color";

export const getBaseStyle = (disabled: boolean) => ({
  padding: "8px 12px",
  borderRadius: 8,
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.5 : 1,
});

export const variantStyles = {
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
} as const;


import { colors } from "@/constants/color";

export const footerStyle = {
  padding: "16px 24px",
  borderTop: `1px solid ${colors.border}`,
  background: colors.bgGray,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: 13,
  color: colors.textSecondary,
} as const;

export const titleStyle = {
  marginLeft: 8,
} as const;

export const infoContainerStyle = {
  display: "flex",
  gap: 16,
} as const;


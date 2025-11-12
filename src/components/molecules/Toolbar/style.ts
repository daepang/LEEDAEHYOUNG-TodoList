import { colors } from "@/constants/color";

export const toolbarStyle = {
  padding: 12,
  borderBottom: `1px solid ${colors.border}`,
  display: "flex",
  gap: 8,
  alignItems: "center",
} as const;

export const filePathStyle = {
  marginLeft: "auto",
  opacity: 0.7,
} as const;


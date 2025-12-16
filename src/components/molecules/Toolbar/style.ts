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
  padding: "6px 12px",
  background: colors.bgGray,
  border: `1px solid ${colors.border}`,
  borderRadius: 4,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  fontSize: 12,
  color: colors.textSecondary,
  maxWidth: 400,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap" as const,
} as const;


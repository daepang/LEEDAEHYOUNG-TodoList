import { colors } from "@/constants/color";

export const sidebarStyle = {
  width: 560,
  borderRight: `1px solid ${colors.border}`,
  padding: 12,
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
  overflowY: "auto" as const,
} as const;


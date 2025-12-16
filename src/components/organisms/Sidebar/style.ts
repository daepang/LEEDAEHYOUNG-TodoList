import { colors } from "@/constants/color";

export const sidebarStyle = {
  width: 560,
  borderRight: `1px solid ${colors.border}`,
  padding: 12,
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gridTemplateRows: "1fr 1fr",
  gap: 8,
  height: "100%",
  overflow: "hidden",
  boxSizing: "border-box" as const,
} as const;


import { colors } from "@/constants/color";

export const getListStyle = () => ({
  border: `1px dashed ${colors.borderDashed}`,
  borderRadius: 8,
  padding: 8,
  height: "100%",
  minHeight: 0,
  display: "flex",
  flexDirection: "column" as const,
  boxSizing: "border-box" as const,
});

export const fileListContentStyle = {
  flex: 1,
  overflowY: "auto" as const,
  minHeight: 0,
} as const;

export const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 6,
} as const;

export const getTitleStyle = (color: string) => ({
  fontWeight: 700,
  color,
});

export const buttonContainerStyle = {
  display: "flex",
  gap: 4,
} as const;

export const getControlButtonStyle = () => ({
  padding: "2px 6px",
  fontSize: 11,
  borderRadius: 4,
  border: `1px solid ${colors.borderLight}`,
  background: colors.white,
  cursor: "pointer",
});


import { colors } from "@/constants/color";

export const getListStyle = () => ({
  flex: 1,
  border: `1px dashed ${colors.borderDashed}`,
  borderRadius: 8,
  padding: 8,
  minHeight: 240,
  overflowY: "auto" as const,
  maxHeight: "calc(100vh - 120px)",
});

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


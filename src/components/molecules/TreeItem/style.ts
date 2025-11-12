import { colors } from "@/constants/color";

export const getTreeItemStyle = (
  level: number,
  isFile: boolean,
  isActive: boolean
) => ({
  paddingLeft: level * 16 + 8,
  paddingTop: 4,
  paddingBottom: 4,
  paddingRight: 8,
  display: "flex",
  alignItems: "center",
  gap: 6,
  cursor: isFile ? "grab" : "pointer",
  background: isFile && isActive ? colors.bgActive : "transparent",
  borderRadius: 4,
  marginBottom: 2,
  userSelect: "none" as const,
});

export const expandIconStyle = {
  fontSize: 12,
  width: 16,
  textAlign: "center" as const,
  fontWeight: "bold" as const,
};

export const fileIconStyle = {
  width: 16,
  textAlign: "center" as const,
};

export const getNodeNameStyle = (isFolder: boolean) => ({
  fontSize: 13,
  fontWeight: isFolder ? 600 : 400,
  opacity: isFolder ? 0.8 : 1,
});


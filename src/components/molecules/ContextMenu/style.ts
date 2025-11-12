import { colors } from "@/constants/color";

export const getMenuStyle = (x: number, y: number) => ({
  position: "fixed" as const,
  top: y,
  left: x,
  background: colors.white,
  border: `1px solid ${colors.gray400}`,
  borderRadius: 6,
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  zIndex: 1000,
  minWidth: 160,
  padding: "4px 0",
});

export const getMenuItemStyle = (disabled?: boolean) => ({
  padding: "8px 16px",
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.5 : 1,
  fontSize: 14,
  userSelect: "none" as const,
  background: colors.white,
});

export const menuItemHoverStyle = {
  background: colors.bgHover,
} as const;


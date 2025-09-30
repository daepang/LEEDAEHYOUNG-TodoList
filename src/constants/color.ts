// 색상 팔레트
export const colors = {
  // Primary Colors
  primary: "#0a66c2",
  primaryLight: "#e6f2ff",
  primaryLighter: "#eef7ff",

  // Gray Scale
  white: "#ffffff",
  gray50: "#fafafa",
  gray100: "#f0f0f0",
  gray200: "#eee",
  gray300: "#ddd",
  gray400: "#ccc",
  gray500: "#999",
  gray600: "#666",
  gray700: "#333",

  // Status Colors
  notStarted: "#6b7280",
  inProgress: "#2563eb",
  pending: "#d97706",
  done: "#16a34a",

  // Borders
  border: "#eee",
  borderDashed: "#ddd",
  borderLight: "#ddd",

  // Backgrounds
  bgGray: "#fafafa",
  bgWhite: "#ffffff",
  bgHover: "#f0f0f0",
  bgActive: "#eef7ff",

  // Text
  textPrimary: "#333",
  textSecondary: "#666",
} as const;

export type Color = (typeof colors)[keyof typeof colors];

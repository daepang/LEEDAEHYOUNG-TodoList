// 색상 팔레트
export const colors = {
  // 주요 색상
  primary: "#0a66c2",
  primaryLight: "#e6f2ff",
  primaryLighter: "#eef7ff",

  // 회색 계열
  white: "#ffffff",
  gray50: "#fafafa",
  gray100: "#f0f0f0",
  gray200: "#eee",
  gray300: "#ddd",
  gray400: "#ccc",
  gray500: "#999",
  gray600: "#666",
  gray700: "#333",

  // 상태 색상
  notStarted: "#6b7280",
  inProgress: "#2563eb",
  pending: "#d97706",
  done: "#16a34a",

  // 테두리
  border: "#eee",
  borderDashed: "#ddd",
  borderLight: "#ddd",

  // 배경
  bgGray: "#fafafa",
  bgWhite: "#ffffff",
  bgHover: "#f0f0f0",
  bgActive: "#eef7ff",

  // 텍스트
  textPrimary: "#333",
  textSecondary: "#666",

  // 그림자 및 투명도
  shadow: "rgba(0, 0, 0, 0.1)",
  shadowLight: "rgba(0, 0, 0, 0.05)",
  whiteTransparent: "rgba(255, 255, 255, 0.9)",
} as const;

export type Color = (typeof colors)[keyof typeof colors];

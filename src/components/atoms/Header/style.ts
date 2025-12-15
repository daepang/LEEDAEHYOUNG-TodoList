import { colors } from "@/constants/color";

export const headerContainerStyle = {
    background: colors.inProgress,
    padding: "12px 24px",
    boxShadow: `0 1px 3px ${colors.shadow}`,
    borderBottom: `1px solid ${colors.shadowLight}`,
} as const;

export const headerTitleStyle = {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
    color: colors.white,
    letterSpacing: "-0.2px",
} as const;

export const headerSubtitleStyle = {
    margin: "2px 0 0 0",
    fontSize: 12,
    fontWeight: 400,
    color: colors.whiteTransparent,
} as const;

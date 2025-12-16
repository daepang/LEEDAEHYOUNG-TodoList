import { colors } from "@/constants/color";

export const editorContainerStyle = {
  display: "flex",
  flex: 1,
  minHeight: 0,
} as const;

export const editorPaneStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column" as const,
  borderRight: `1px solid ${colors.border}`,
};

export const labelContainerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px 12px",
  borderBottom: `1px solid ${colors.border}`,
} as const;

export const labelStyle = {
  fontWeight: 700,
  fontSize: 12,
  opacity: 0.7,
} as const;

export const toggleButtonStyle = {
  padding: "4px 8px",
  fontSize: 11,
  fontWeight: 500,
  borderRadius: 4,
  border: `1px solid ${colors.borderLight}`,
  background: colors.white,
  cursor: "pointer",
  transition: "all 0.2s ease",
} as const;

export const textareaStyle = {
  flex: 1,
  padding: 12,
  outline: "none",
  border: "none",
  fontFamily:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  fontSize: 14,
  resize: "none" as const,
} as const;

export const previewPaneStyle = {
  flex: 1,
  padding: 12,
  overflow: "auto" as const,
} as const;

export const previewTitleStyle = {
  fontWeight: 700,
  marginBottom: 8,
} as const;

export const previewContentStyle = {
  lineHeight: 1.6,
} as const;


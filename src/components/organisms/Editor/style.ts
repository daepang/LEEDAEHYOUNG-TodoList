export const editorContainerStyle = {
  display: "flex",
  flex: 1,
  minHeight: 0,
} as const;

export const editorPaneStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column" as const,
};

export const labelStyle = {
  padding: "8px 12px",
  fontWeight: 700,
  fontSize: 12,
  opacity: 0.7,
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


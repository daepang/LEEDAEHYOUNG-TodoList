export const containerStyle = {
  display: "flex",
  flexDirection: "column" as const,
  height: "100vh",
  fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
} as const;

export const mainContentStyle = {
  display: "flex",
  flex: 1,
  minHeight: 0,
} as const;

export const editorContainerStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column" as const,
} as const;


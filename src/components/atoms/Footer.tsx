import React from "react";
import { colors } from "@/constants/color";

export function Footer() {
  return (
    <footer
      style={{
        padding: "16px 24px",
        borderTop: `1px solid ${colors.border}`,
        background: colors.bgGray,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 13,
        color: colors.textSecondary,
      }}
    >
      <div>
        <strong>LEEDAEHYOUNG TodoList</strong>
        <span style={{ marginLeft: 8 }}>v1.0.0</span>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        <span>💾 로컬 마크다운 기반</span>
        <span>⚡ Next.js + TypeScript</span>
      </div>
    </footer>
  );
}

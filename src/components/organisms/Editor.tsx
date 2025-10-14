import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface EditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

export function Editor({ content, onContentChange }: EditorProps) {
  return (
    <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="- [✅] 할 일 작성&#10;- [x] 완료 항목"
        style={{
          flex: 1,
          padding: 12,
          outline: "none",
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          fontSize: 14,
        }}
      />
      <div style={{ flex: 1, padding: 12, overflow: "auto" }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>미리보기</div>
        <div style={{ lineHeight: 1.6 }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content || "_미리보기 없음_"}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

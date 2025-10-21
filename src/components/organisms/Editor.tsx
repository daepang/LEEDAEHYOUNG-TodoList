import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface EditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

export function Editor({ content, onContentChange }: EditorProps) {
  return (
    <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <label
          htmlFor="markdown-editor"
          style={{
            padding: "8px 12px",
            fontWeight: 700,
            fontSize: 12,
            opacity: 0.7,
          }}
        >
          마크다운 편집
        </label>
        <textarea
          id="markdown-editor"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="- [✅] 할 일 작성&#10;- [x] 완료 항목"
          aria-label="마크다운 편집기"
          style={{
            flex: 1,
            padding: 12,
            outline: "none",
            border: "none",
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize: 14,
            resize: "none",
          }}
        />
      </div>
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

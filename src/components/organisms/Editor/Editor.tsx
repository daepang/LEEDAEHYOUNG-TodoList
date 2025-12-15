import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  editorContainerStyle,
  editorPaneStyle,
  labelStyle,
  textareaStyle,
  previewPaneStyle,
  previewTitleStyle,
  previewContentStyle,
} from "./style";

interface EditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

export function Editor({ content, onContentChange }: EditorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      // Insert 2 spaces at cursor position
      const newContent =
        content.substring(0, start) + "  " + content.substring(end);

      onContentChange(newContent);

      // Move cursor after the inserted spaces
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div style={editorContainerStyle}>
      <div style={editorPaneStyle}>
        <label htmlFor="markdown-editor" style={labelStyle}>
          마크다운 편집
        </label>
        <textarea
          id="markdown-editor"
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="- [✅] 할 일 작성&#10;- [x] 완료 항목"
          aria-label="마크다운 편집기"
          style={textareaStyle}
        />
      </div>
      <div style={previewPaneStyle}>
        <div style={previewTitleStyle}>미리보기</div>
        <div style={previewContentStyle}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content || "_미리보기 없음_"}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}


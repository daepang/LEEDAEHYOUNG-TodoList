import { Button } from "@/components/atoms/Button/Button";
import { toolbarStyle, filePathStyle } from "./style";

interface ToolbarProps {
  onCreateFile: () => void;
  onSave: () => void;
  saving: boolean;
  activeFilePath: string | null;
}

export function Toolbar({
  onCreateFile,
  onSave,
  saving,
  activeFilePath,
}: ToolbarProps) {
  return (
    <div style={toolbarStyle}>
      <Button onClick={onCreateFile}>오늘 파일 만들기</Button>
      <Button
        onClick={onSave}
        disabled={!activeFilePath || saving}
        variant="primary"
      >
        {saving ? "저장 중..." : "저장"}
      </Button>
      <div style={filePathStyle}>{activeFilePath || "파일을 선택하세요"}</div>
    </div>
  );
}


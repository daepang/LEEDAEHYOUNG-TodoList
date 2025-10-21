import { Button } from "../atoms/Button";
import { colors } from "@/constants/color";

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
    <div
      style={{
        padding: 12,
        borderBottom: `1px solid ${colors.border}`,
        display: "flex",
        gap: 8,
        alignItems: "center",
      }}
    >
      <Button onClick={onCreateFile}>오늘 파일 만들기</Button>
      <Button
        onClick={onSave}
        disabled={!activeFilePath || saving}
        variant="primary"
      >
        {saving ? "저장 중..." : "저장"}
      </Button>
      <div style={{ marginLeft: "auto", opacity: 0.7 }}>
        {activeFilePath || "파일을 선택하세요"}
      </div>
    </div>
  );
}

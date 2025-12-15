import { Sidebar } from "@/components/organisms/Sidebar/Sidebar";
import { Toolbar } from "@/components/molecules/Toolbar/Toolbar";
import { Editor } from "@/components/organisms/Editor/Editor";
import { Footer } from "@/components/atoms/Footer/Footer";
import { Header } from "@/components/atoms/Header/Header";
import { type FileItem } from "@/constants/types";
import { type FolderType } from "@/constants/folders";
import { containerStyle, mainContentStyle, editorContainerStyle } from "./style";

interface TodoTemplateProps {
  notStarted: FileItem[];
  inProgress: FileItem[];
  pending: FileItem[];
  done: FileItem[];
  activeFile: FileItem | null;
  content: string;
  saving: boolean;
  onContentChange: (content: string) => void;
  onDragStart: (e: React.DragEvent, file: FileItem) => void;
  onDropTo: (folder: FolderType, e: React.DragEvent) => void;
  onFileClick: (file: FileItem) => void;
  onCreateFile: () => void;
  onSave: () => void;
  onCreateFolder?: (parentPath: string) => void;
  onDelete?: (path: string) => void;
  onRename?: (path: string, currentName: string) => void;
}

export function TodoTemplate({
  notStarted,
  inProgress,
  pending,
  done,
  activeFile,
  content,
  saving,
  onContentChange,
  onDragStart,
  onDropTo,
  onFileClick,
  onCreateFile,
  onSave,
  onCreateFolder,
  onDelete,
  onRename,
}: TodoTemplateProps) {
  return (
    <div style={containerStyle}>
      <Header />
      <div style={mainContentStyle}>
        <Sidebar
          notStarted={notStarted}
          inProgress={inProgress}
          pending={pending}
          done={done}
          activeFilePath={activeFile?.path || null}
          onDragStart={onDragStart}
          onDropTo={onDropTo}
          onFileClick={onFileClick}
          onCreateFolder={onCreateFolder}
          onDelete={onDelete}
          onRename={onRename}
        />

        <div style={editorContainerStyle}>
          <Toolbar
            onCreateFile={onCreateFile}
            onSave={onSave}
            saving={saving}
            activeFilePath={activeFile?.path || null}
          />
          <Editor content={content} onContentChange={onContentChange} />
        </div>
      </div>

      <Footer />
    </div>
  );
}


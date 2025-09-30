import React from "react";
import { Sidebar } from "../organisms/Sidebar";
import { Toolbar } from "../molecules/Toolbar";
import { Editor } from "../organisms/Editor";
import { Footer } from "../atoms/Footer";
import { type FileItem } from "@/constants/types";
import { type FolderType } from "@/constants/folders";

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
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

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
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

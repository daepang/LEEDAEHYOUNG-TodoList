import React, { useMemo } from "react";
import { FileList } from "./FileList";
import { type FileItem } from "@/constants/types";
import { type FolderType } from "@/constants/folders";
import { FOLDER_CONFIGS } from "@/constants/folders";
import { colors } from "@/constants/color";

interface SidebarProps {
  notStarted: FileItem[];
  inProgress: FileItem[];
  pending: FileItem[];
  done: FileItem[];
  activeFilePath: string | null;
  onDragStart: (e: React.DragEvent, file: FileItem) => void;
  onDropTo: (folder: FolderType, e: React.DragEvent) => void;
  onFileClick: (file: FileItem) => void;
  onCreateFolder?: (parentPath: string) => void;
  onDelete?: (path: string) => void;
  onRename?: (path: string, currentName: string) => void;
}

export function Sidebar({
  notStarted,
  inProgress,
  pending,
  done,
  activeFilePath,
  onDragStart,
  onDropTo,
  onFileClick,
  onCreateFolder,
  onDelete,
  onRename,
}: SidebarProps) {
  const sidebarStyle: React.CSSProperties = useMemo(
    () => ({
      width: 560,
      borderRight: `1px solid ${colors.border}`,
      padding: 12,
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
      overflowY: "auto",
    }),
    []
  );

  const filesMap: Record<FolderType, FileItem[]> = {
    "not-started": notStarted,
    "in-progress": inProgress,
    pending,
    done,
  };

  return (
    <div style={sidebarStyle}>
      {FOLDER_CONFIGS.map((config) => (
        <FileList
          key={config.key}
          title={config.title}
          files={filesMap[config.key]}
          folder={config.key}
          color={config.color}
          activeFilePath={activeFilePath}
          onDragStart={onDragStart}
          onDropTo={onDropTo}
          onFileClick={onFileClick}
          onCreateFolder={onCreateFolder}
          onDelete={onDelete}
          onRename={onRename}
        />
      ))}
    </div>
  );
}

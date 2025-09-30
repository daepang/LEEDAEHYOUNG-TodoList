import React, { useMemo } from "react";
import { TreeItem } from "../molecules/TreeItem";
import { type FileItem } from "@/constants/types";
import { type FolderType } from "@/constants/folders";
import { buildFileTree } from "@/utils/fileTree";
import { colors } from "@/constants/color";

interface FileListProps {
  title: string;
  files: FileItem[];
  folder: FolderType;
  color: string;
  activeFilePath: string | null;
  onDragStart: (e: React.DragEvent, file: FileItem) => void;
  onDropTo: (folder: FolderType, e: React.DragEvent) => void;
  onFileClick: (file: FileItem) => void;
  onCreateFolder?: (parentPath: string) => void;
  onDelete?: (path: string) => void;
  onRename?: (path: string, currentName: string) => void;
}

export function FileList({
  title,
  files,
  folder,
  color,
  activeFilePath,
  onDragStart,
  onDropTo,
  onFileClick,
  onCreateFolder,
  onDelete,
  onRename,
}: FileListProps) {
  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const tree = useMemo(() => buildFileTree(files), [files]);

  const listStyle: React.CSSProperties = {
    flex: 1,
    border: `1px dashed ${colors.borderDashed}`,
    borderRadius: 8,
    padding: 8,
    minHeight: 240,
    overflowY: "auto",
    maxHeight: "calc(100vh - 120px)",
  };

  return (
    <div
      onDragOver={allowDrop}
      onDrop={(e) => onDropTo(folder, e)}
      style={listStyle}
      aria-label={`${title} dropzone`}
      title={`여기에 드랍하면 ${title}으로 이동`}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <div style={{ fontWeight: 700, color }}>{title}</div>
        {onCreateFolder && (
          <button
            onClick={() => onCreateFolder(`/${folder}`)}
            style={{
              padding: "2px 6px",
              fontSize: 11,
              borderRadius: 4,
              border: `1px solid ${colors.borderLight}`,
              background: colors.white,
              cursor: "pointer",
            }}
            title="새 폴더 만들기"
          >
            + 폴더
          </button>
        )}
      </div>
      {tree.map((node) => (
        <TreeItem
          key={node.path}
          node={node}
          level={0}
          activeFilePath={activeFilePath}
          onDragStart={onDragStart}
          onFileClick={onFileClick}
          onCreateFolder={onCreateFolder}
          onDelete={onDelete}
          onRename={onRename}
        />
      ))}
    </div>
  );
}

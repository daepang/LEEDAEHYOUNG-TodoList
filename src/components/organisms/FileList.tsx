import React, { useMemo, useState, useCallback } from "react";
import { TreeItem } from "../molecules/TreeItem";
import { type FileItem, type TreeNode } from "@/constants/types";
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

  // 모든 폴더 경로를 수집하는 함수
  const collectAllFolderPaths = useCallback((nodes: TreeNode[]): string[] => {
    const paths: string[] = [];
    const traverse = (node: TreeNode) => {
      if (node.type === "folder") {
        paths.push(node.path);
        if (node.children) {
          node.children.forEach(traverse);
        }
      }
    };
    nodes.forEach(traverse);
    return paths;
  }, []);

  // 기본적으로 모든 폴더를 펼친 상태로 시작
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(() => {
    return new Set(collectAllFolderPaths(tree));
  });

  // tree가 변경될 때 expandedPaths 업데이트
  React.useEffect(() => {
    setExpandedPaths(new Set(collectAllFolderPaths(tree)));
  }, [tree, collectAllFolderPaths]);

  const handleToggle = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setExpandedPaths(new Set(collectAllFolderPaths(tree)));
  };

  const handleCollapseAll = () => {
    setExpandedPaths(new Set());
  };

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
          gap: 4,
        }}
      >
        <div style={{ fontWeight: 700, color }}>{title}</div>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={handleExpandAll}
            style={{
              padding: "2px 6px",
              fontSize: 11,
              borderRadius: 4,
              border: `1px solid ${colors.borderLight}`,
              background: colors.white,
              cursor: "pointer",
            }}
            title="모두 펼치기"
          >
            모두 펼치기
          </button>
          <button
            onClick={handleCollapseAll}
            style={{
              padding: "2px 6px",
              fontSize: 11,
              borderRadius: 4,
              border: `1px solid ${colors.borderLight}`,
              background: colors.white,
              cursor: "pointer",
            }}
            title="모두 접기"
          >
            모두 접기
          </button>
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
          expandedPaths={expandedPaths}
          onToggleExpand={handleToggle}
        />
      ))}
    </div>
  );
}

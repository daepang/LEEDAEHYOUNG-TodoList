import { useMemo, useState, useCallback, useEffect } from "react";
import { TreeItem } from "@/components/molecules/TreeItem/TreeItem";
import { type FileItem, type TreeNode } from "@/constants/types";
import { type FolderType } from "@/constants/folders";
import { buildFileTree } from "@/utils/fileTree";
import {
  getListStyle,
  headerStyle,
  getTitleStyle,
  buttonContainerStyle,
  getControlButtonStyle,
} from "./style";

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

  const handleDrop = (e: React.DragEvent) => {
    onDropTo(folder, e);
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
  useEffect(() => {
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

  const handleCreateFolder = () => {
    if (onCreateFolder) {
      onCreateFolder(`/${folder}`);
    }
  };

  return (
    <div
      onDragOver={allowDrop}
      onDrop={handleDrop}
      style={getListStyle()}
      aria-label={`${title} dropzone`}
      title={`여기에 드랍하면 ${title}으로 이동`}
    >
      <div style={headerStyle}>
        <div style={getTitleStyle(color)}>{title}</div>
        <div style={buttonContainerStyle}>
          <button
            onClick={handleExpandAll}
            style={getControlButtonStyle()}
            title="모두 펼치기"
          >
            모두 펼치기
          </button>
          <button
            onClick={handleCollapseAll}
            style={getControlButtonStyle()}
            title="모두 접기"
          >
            모두 접기
          </button>
          {onCreateFolder && (
            <button
              onClick={handleCreateFolder}
              style={getControlButtonStyle()}
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

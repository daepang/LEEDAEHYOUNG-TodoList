import { useState } from "react";
import { type TreeNode, type FileItem } from "@/constants/types";
import { ContextMenu } from "@/components/molecules/ContextMenu/ContextMenu";
import {
  getTreeItemStyle,
  expandIconStyle,
  fileIconStyle,
  getNodeNameStyle,
} from "./style";

interface TreeItemProps {
  node: TreeNode;
  level: number;
  activeFilePath: string | null;
  onDragStart: (e: React.DragEvent, file: FileItem) => void;
  onFileClick: (file: FileItem) => void;
  onCreateFolder?: (parentPath: string) => void;
  onDelete?: (path: string) => void;
  onRename?: (path: string, currentName: string) => void;
  expandedPaths: Set<string>;
  onToggleExpand: (path: string) => void;
}

export function TreeItem({
  node,
  level,
  activeFilePath,
  onDragStart,
  onFileClick,
  onCreateFolder,
  onDelete,
  onRename,
  expandedPaths,
  onToggleExpand,
}: TreeItemProps) {
  const isExpanded = expandedPaths.has(node.path);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.type === "folder") {
      onToggleExpand(node.path);
    }
  };

  const handleClick = () => {
    if (node.type === "file") {
      onFileClick({ name: node.name, path: node.path });
    } else {
      onToggleExpand(node.path);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const isFile = node.type === "file";
  const isActive = isFile && activeFilePath === node.path;

  // 컨텍스트 메뉴 항목 정의
  const menuItems = [
    ...(node.type === "folder"
      ? [
          {
            label: "새 폴더",
            onClick: () => onCreateFolder?.(node.path),
          },
        ]
      : []),
    {
      label: "이름 변경",
      onClick: () => onRename?.(node.path, node.name),
    },
    {
      label: "삭제",
      onClick: () => onDelete?.(node.path),
    },
  ];

  return (
    <>
      <div
        draggable={isFile}
        onDragStart={
          isFile
            ? (e) => onDragStart(e, { name: node.name, path: node.path })
            : undefined
        }
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        style={getTreeItemStyle(level, isFile, isActive)}
      >
        {node.type === "folder" && (
          <span onClick={handleToggle} style={expandIconStyle}>
            {isExpanded ? "−" : "+"}
          </span>
        )}
        {isFile && <span style={fileIconStyle}>📄</span>}
        <span style={getNodeNameStyle(node.type === "folder")}>
          {node.name}
        </span>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={handleCloseContextMenu}
          items={menuItems}
        />
      )}

      {node.type === "folder" && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeItem
              key={child.path}
              node={child}
              level={level + 1}
              activeFilePath={activeFilePath}
              onDragStart={onDragStart}
              onFileClick={onFileClick}
              onCreateFolder={onCreateFolder}
              onDelete={onDelete}
              onRename={onRename}
              expandedPaths={expandedPaths}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </>
  );
}

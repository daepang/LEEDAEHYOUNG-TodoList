import React from "react";
import { type FileItem } from "@/constants/types";

interface FileItemProps {
  file: FileItem;
  isActive: boolean;
  onDragStart: (e: React.DragEvent, file: FileItem) => void;
  onClick: () => void;
}

export function FileItem({
  file,
  isActive,
  onDragStart,
  onClick,
}: FileItemProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, file)}
      onClick={onClick}
      style={{
        padding: "6px 8px",
        borderRadius: 6,
        background: isActive ? "#eef7ff" : "#fafafa",
        marginBottom: 6,
        cursor: "grab",
        border: "1px solid #eee",
      }}
    >
      {file.name}
    </div>
  );
}

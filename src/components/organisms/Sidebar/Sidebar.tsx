import { FileList } from "@/components/organisms/FileList/FileList";
import { type FileItem } from "@/constants/types";
import { type FolderType, FOLDER_CONFIGS } from "@/constants/folders";
import { sidebarStyle } from "./style";

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


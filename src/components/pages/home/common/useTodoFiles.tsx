import { useState, useEffect } from "react";
import { type FolderType } from "@/constants/folders";
import { type FileItem } from "@/constants/types";
import {
  fetchFiles,
  fetchContent,
  saveContent,
  moveFile,
  createNewFile,
  createFolder,
  deletePath,
  renamePath,
} from "@/utils/api";

export function useTodoFiles() {
  const [notStarted, setNotStarted] = useState<FileItem[]>([]);
  const [inProgress, setInProgress] = useState<FileItem[]>([]);
  const [pending, setPending] = useState<FileItem[]>([]);
  const [done, setDone] = useState<FileItem[]>([]);
  const [active, setActive] = useState<FileItem | null>(null);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const reload = async () => {
    const [ns, ip, p, d] = await Promise.all([
      fetchFiles("not-started"),
      fetchFiles("in-progress"),
      fetchFiles("pending"),
      fetchFiles("done"),
    ]);
    setNotStarted(ns);
    setInProgress(ip);
    setPending(p);
    setDone(d);
    if (!active && ns[0]) {
      openFile(ns[0]);
    }
  };

  const openFile = async (file: FileItem) => {
    try {
      const c = await fetchContent(file.path);
      setActive(file);
      setContent(c);
    } catch {
      setActive(file);
      setContent("");
    }
  };

  const handleSave = async () => {
    if (!active) return;
    setSaving(true);
    try {
      await saveContent(active.path, content);
      alert("저장되었습니다! ✓");
    } catch (error) {
      alert("저장에 실패했습니다.");
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateFile = async () => {
    const path = await createNewFile();
    await reload();
    const fileName = path.split("/").pop();
    if (fileName) {
      const file = { name: fileName, path };
      openFile(file);
    }
  };

  const onDragStart = (e: React.DragEvent, item: FileItem) => {
    e.dataTransfer.setData("text/plain", item.path);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDropTo = async (folder: FolderType, e: React.DragEvent) => {
    e.preventDefault();
    const fromPath = e.dataTransfer.getData("text/plain");
    if (!fromPath) return;

    // fromPath: /not-started/2025/09/2025-09-30.md
    const parts = fromPath.split("/").filter(Boolean);
    // parts: ['not-started', '2025', '09', '2025-09-30.md']

    // 연도/월/파일명 구조 유지
    const pathWithoutFolder = parts.slice(1).join("/"); // '2025/09/2025-09-30.md'
    const toPath = `/${folder}/${pathWithoutFolder}`;

    if (fromPath === toPath) return;

    await moveFile(fromPath, toPath);
    await reload();

    if (active && active.path === fromPath) {
      const name = parts[parts.length - 1];
      if (name) {
        setActive({ name, path: toPath });
      }
    }
  };

  const handleCreateFolder = async (parentPath: string) => {
    const folderName = prompt("폴더 이름을 입력하세요:");
    if (!folderName) return;

    const newFolderPath = `${parentPath}/${folderName}`;
    try {
      await createFolder(newFolderPath);
      await reload();
      alert(`폴더가 생성되었습니다: ${folderName}`);
    } catch (error) {
      alert("폴더 생성에 실패했습니다.");
      console.error("Create folder error:", error);
    }
  };

  const handleDelete = async (path: string) => {
    const confirmed = confirm(`정말로 삭제하시겠습니까?\n${path}`);
    if (!confirmed) return;

    await deletePath(path);
    await reload();

    if (active && active.path === path) {
      setActive(null);
      setContent("");
    }
  };

  const handleRename = async (path: string, currentName: string) => {
    const newName = prompt("새 이름을 입력하세요:", currentName);
    if (!newName || newName === currentName) return;

    const newPath = await renamePath(path, newName);
    await reload();

    if (active && active.path === path) {
      const name = newPath.split("/").pop();
      if (name) {
        setActive({ name, path: newPath });
      }
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    notStarted,
    inProgress,
    pending,
    done,
    active,
    content,
    saving,
    setContent,
    openFile,
    handleSave,
    handleCreateFile,
    onDragStart,
    onDropTo,
    handleCreateFolder,
    handleDelete,
    handleRename,
  };
}

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

  // 모든 폴더의 파일 목록을 다시 불러옴
  const handleReload = async () => {
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
      handleOpenFile(ns[0]);
    }
  };

  // 파일을 열고 내용을 불러옴
  const handleOpenFile = async (file: FileItem) => {
    try {
      const c = await fetchContent(file.path);
      setActive(file);
      setContent(c);
    } catch {
      setActive(file);
      setContent("");
    }
  };

  // 현재 활성화된 파일을 저장
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

  // 오늘 날짜로 새 파일 생성
  const handleCreateFile = async () => {
    const path = await createNewFile();
    await handleReload();
    const fileName = path.split("/").pop();
    if (fileName) {
      const file = { name: fileName, path };
      handleOpenFile(file);
    }
  };

  // 드래그 시작 시 파일 경로 전달
  const handleDragStart = (e: React.DragEvent, item: FileItem) => {
    e.dataTransfer.setData("text/plain", item.path);
    e.dataTransfer.effectAllowed = "move";
  };

  // 드롭 시 파일을 다른 폴더로 이동
  const handleDropTo = async (folder: FolderType, e: React.DragEvent) => {
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
    await handleReload();

    if (active && active.path === fromPath) {
      const name = parts[parts.length - 1];
      if (name) {
        setActive({ name, path: toPath });
      }
    }
  };

  // 새 폴더 생성
  const handleCreateFolder = async (parentPath: string) => {
    const folderName = prompt("폴더 이름을 입력하세요:");
    if (!folderName) return;

    const newFolderPath = `${parentPath}/${folderName}`;
    try {
      await createFolder(newFolderPath);
      await handleReload();
      alert(`폴더가 생성되었습니다: ${folderName}`);
    } catch (error) {
      alert("폴더 생성에 실패했습니다.");
      console.error("Create folder error:", error);
    }
  };

  // 파일 또는 폴더 삭제
  const handleDelete = async (path: string) => {
    const confirmed = confirm(`정말로 삭제하시겠습니까?\n${path}`);
    if (!confirmed) return;

    await deletePath(path);
    await handleReload();

    if (active && active.path === path) {
      setActive(null);
      setContent("");
    }
  };

  // 파일 또는 폴더 이름 변경
  const handleRename = async (path: string, currentName: string) => {
    const newName = prompt("새 이름을 입력하세요:", currentName);
    if (!newName || newName === currentName) return;

    const newPath = await renamePath(path, newName);
    await handleReload();

    if (active && active.path === path) {
      const name = newPath.split("/").pop();
      if (name) {
        setActive({ name, path: newPath });
      }
    }
  };

  useEffect(() => {
    handleReload();
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
    openFile: handleOpenFile,
    handleSave,
    handleCreateFile,
    onDragStart: handleDragStart,
    onDropTo: handleDropTo,
    handleCreateFolder,
    handleDelete,
    handleRename,
  };
}

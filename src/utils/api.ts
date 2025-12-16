import { type FolderType } from "@/constants/folders";
import { type FileItem } from "@/constants/types";

const isElectron = () => typeof window !== 'undefined' && window.electronAPI;

export async function fetchFiles(folder: FolderType): Promise<FileItem[]> {
  if (isElectron()) {
    return await window.electronAPI!.listFiles(folder);
  }
  const res = await fetch(`/api/files?folder=${folder}`, {
    cache: "no-store",
  });
  const json = await res.json();
  return json.files as FileItem[];
}

export async function fetchContent(path: string): Promise<string> {
  if (isElectron()) {
    return await window.electronAPI!.readFile(path);
  }
  const res = await fetch(`/api/file?path=${encodeURIComponent(path)}`, {
    cache: "no-store",
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.content as string;
}

export async function saveContent(
  path: string,
  content: string
): Promise<void> {
  if (isElectron()) {
    await window.electronAPI!.saveFile(path, content);
    return;
  }
  await fetch(`/api/file`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ path, content }),
  });
}

export async function moveFile(from: string, to: string): Promise<void> {
  if (isElectron()) {
    await window.electronAPI!.moveFile(from, to);
    return;
  }
  await fetch(`/api/move`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ from, to }),
  });
}

export async function createNewFile(): Promise<string> {
  if (isElectron()) {
    const { path } = await window.electronAPI!.createNewFile();
    return path;
  }
  const res = await fetch("/api/new", { method: "POST" });
  const { path } = await res.json();
  return path;
}

export async function createFolder(path: string): Promise<void> {
  if (isElectron()) {
    await window.electronAPI!.createFolder(path);
    return;
  }
  await fetch("/api/create-folder", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ path }),
  });
}

export async function deletePath(path: string): Promise<void> {
  if (isElectron()) {
    await window.electronAPI!.deletePath(path);
    return;
  }
  await fetch("/api/delete", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ path }),
  });
}

export async function renamePath(
  path: string,
  newName: string
): Promise<string> {
  if (isElectron()) {
    return await window.electronAPI!.renamePath(path, newName);
  }
  const res = await fetch("/api/rename", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ path, newName }),
  });
  const { newPath } = await res.json();
  return newPath;
}

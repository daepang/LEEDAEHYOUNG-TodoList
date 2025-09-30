import { type FolderType } from "@/constants/folders";
import { type FileItem } from "@/constants/types";

export async function fetchFiles(folder: FolderType): Promise<FileItem[]> {
  const res = await fetch(`/api/files?folder=${folder}`, {
    cache: "no-store",
  });
  const json = await res.json();
  return json.files as FileItem[];
}

export async function fetchContent(path: string): Promise<string> {
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
  await fetch(`/api/file`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ path, content }),
  });
}

export async function moveFile(from: string, to: string): Promise<void> {
  await fetch(`/api/move`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ from, to }),
  });
}

export async function createNewFile(): Promise<string> {
  const res = await fetch("/api/new", { method: "POST" });
  const { path } = await res.json();
  return path;
}

export async function createFolder(path: string): Promise<void> {
  await fetch("/api/create-folder", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ path }),
  });
}

export async function deletePath(path: string): Promise<void> {
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
  const res = await fetch("/api/rename", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ path, newName }),
  });
  const { newPath } = await res.json();
  return newPath;
}

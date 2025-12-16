// src/app/api/_fs.ts
import { promises as fs } from "fs";
import path from "path";

export const VAULT_ROOT = path.join(process.cwd(), "vault");
export const NOT_STARTED_DIR = path.join(VAULT_ROOT, "not-started");
export const IN_PROGRESS_DIR = path.join(VAULT_ROOT, "in-progress");
export const PENDING_DIR = path.join(VAULT_ROOT, "pending");
export const DONE_DIR = path.join(VAULT_ROOT, "done");

export async function ensureDirs() {
  await fs.mkdir(NOT_STARTED_DIR, { recursive: true });
  await fs.mkdir(IN_PROGRESS_DIR, { recursive: true });
  await fs.mkdir(PENDING_DIR, { recursive: true });
  await fs.mkdir(DONE_DIR, { recursive: true });
}

export function safeJoin(base: string, p: string) {
  const target = path.normalize(path.join(base, p));
  if (!target.startsWith(base)) throw new Error("Invalid path");
  return target;
}

/**
 * Get the base directory path for a given folder type
 * @param folder - The folder type (not-started, in-progress, pending, done)
 * @returns The absolute path to the folder directory
 */
export function getBaseDirByFolder(folder: string): string {
  switch (folder) {
    case "not-started":
      return NOT_STARTED_DIR;
    case "in-progress":
      return IN_PROGRESS_DIR;
    case "pending":
      return PENDING_DIR;
    case "done":
      return DONE_DIR;
    default:
      return NOT_STARTED_DIR;
  }
}

export type FolderType = "not-started" | "in-progress" | "pending" | "done";

async function listFilesRecursive(
  dir: string,
  baseDir: string,
  folderType: FolderType
): Promise<Array<{ name: string; path: string; type?: "file" | "folder" }>> {
  const results: Array<{
    name: string;
    path: string;
    type?: "file" | "folder";
  }> = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(baseDir, fullPath);
      const vaultPath = `/${folderType}/${relativePath.replace(/\\/g, "/")}`;

      if (entry.isDirectory()) {
        // 폴더도 결과에 추가
        results.push({
          name: entry.name,
          path: vaultPath,
          type: "folder",
        });

        // 하위 항목들도 추가
        const subResults = await listFilesRecursive(
          fullPath,
          baseDir,
          folderType
        );
        results.push(...subResults);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        results.push({
          name: entry.name,
          path: vaultPath,
          type: "file",
        });
      }
    }
  } catch (error) {
    // 폴더가 없으면 빈 배열 반환
  }

  return results;
}

export async function listFiles(dir: FolderType) {
  await ensureDirs();
  const base = getBaseDirByFolder(dir);
  return await listFilesRecursive(base, base, dir);
}

export async function readFileByVaultPath(vaultPath: string) {
  await ensureDirs();
  const parts = vaultPath.split("/");
  const folder = parts[1]; // "/pending/2025-09-30.md"의 경우 "pending"
  const rest = parts.slice(2);

  const base = getBaseDirByFolder(folder);
  const rel = rest.join("/");
  const file = safeJoin(base, rel);
  return fs.readFile(file, "utf8");
}

export async function writeFileByVaultPath(vaultPath: string, content: string) {
  await ensureDirs();
  const parts = vaultPath.split("/");
  const folder = parts[1];
  const rest = parts.slice(2);

  const base = getBaseDirByFolder(folder);
  const rel = rest.join("/");
  const file = safeJoin(base, rel);

  // 디렉토리가 없으면 생성
  const dir = path.dirname(file);
  await fs.mkdir(dir, { recursive: true });

  await fs.writeFile(file, content, "utf8");
}

export async function moveFile(fromVaultPath: string, toVaultPath: string) {
  await ensureDirs();
  const fromParts = fromVaultPath.split("/");
  const toParts = toVaultPath.split("/");
  const f1 = fromParts[1];
  const r1 = fromParts.slice(2);
  const f2 = toParts[1];
  const r2 = toParts.slice(2);

  const base1 = getBaseDirByFolder(f1);
  const base2 = getBaseDirByFolder(f2);
  const src = safeJoin(base1, r1.join("/"));
  const dest = safeJoin(base2, r2.join("/"));

  // 대상 디렉토리가 없으면 생성
  const destDir = path.dirname(dest);
  await fs.mkdir(destDir, { recursive: true });

  await fs.rename(src, dest);
}

export async function createFolder(vaultPath: string) {
  await ensureDirs();
  const parts = vaultPath.split("/");
  const folder = parts[1];
  const rest = parts.slice(2);

  const base = getBaseDirByFolder(folder);
  const folderPath = safeJoin(base, rest.join("/"));
  await fs.mkdir(folderPath, { recursive: true });
}

export async function deletePath(vaultPath: string) {
  await ensureDirs();
  const parts = vaultPath.split("/");
  const folder = parts[1];
  const rest = parts.slice(2);

  const base = getBaseDirByFolder(folder);
  const targetPath = safeJoin(base, rest.join("/"));

  // 파일인지 폴더인지 확인
  const stat = await fs.stat(targetPath);
  if (stat.isDirectory()) {
    await fs.rm(targetPath, { recursive: true, force: true });
  } else {
    await fs.unlink(targetPath);
  }
}

export async function renamePath(fromVaultPath: string, newName: string) {
  await ensureDirs();
  const parts = fromVaultPath.split("/");
  const folder = parts[1];
  const rest = parts.slice(2);

  const base = getBaseDirByFolder(folder);
  const oldPath = safeJoin(base, rest.join("/"));
  const parentDir = path.dirname(oldPath);
  const newPath = path.join(parentDir, newName);

  await fs.rename(oldPath, newPath);

  // 새 경로 반환 (vault path 형식)
  const relativePath = path.relative(base, newPath);
  return `/${folder}/${relativePath.replace(/\\/g, "/")}`;
}

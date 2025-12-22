import { app, BrowserWindow, ipcMain, protocol } from "electron";
import path from "path";
import fs from "fs/promises";

// Vault configuration
// app.isPackaged는 Electron이 제공하는 내장 속성으로, 패키징된 프로덕션 빌드인지 확인
const IS_DEV = !app.isPackaged;
const VAULT_ROOT = IS_DEV
  ? path.join(process.cwd(), "vault")
  : path.join(app.getPath("documents"), "LEEDAEHYOUNG-TodoList", "vault");

const NOT_STARTED_DIR = path.join(VAULT_ROOT, "not-started");
const IN_PROGRESS_DIR = path.join(VAULT_ROOT, "in-progress");
const PENDING_DIR = path.join(VAULT_ROOT, "pending");
const DONE_DIR = path.join(VAULT_ROOT, "done");

type FolderType = "not-started" | "in-progress" | "pending" | "done";

async function ensureDirs() {
  await fs.mkdir(NOT_STARTED_DIR, { recursive: true });
  await fs.mkdir(IN_PROGRESS_DIR, { recursive: true });
  await fs.mkdir(PENDING_DIR, { recursive: true });
  await fs.mkdir(DONE_DIR, { recursive: true });
}

function getBaseDirByFolder(folder: string): string {
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

function safeJoin(base: string, p: string) {
  const target = path.normalize(path.join(base, p));
  if (!target.startsWith(base)) throw new Error("Invalid path");
  return target;
}

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
        results.push({ name: entry.name, path: vaultPath, type: "folder" });
        const subResults = await listFilesRecursive(
          fullPath,
          baseDir,
          folderType
        );
        results.push(...subResults);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        results.push({ name: entry.name, path: vaultPath, type: "file" });
      }
    }
  } catch (error) {
    // Ignore errors (e.g., folder not found)
  }
  return results;
}

function createWindow() {
  console.log("=== Electron App Starting ===");
  console.log("IS_DEV:", IS_DEV);
  console.log("__dirname:", __dirname);
  console.log("app.isPackaged:", app.isPackaged);
  console.log("process.resourcesPath:", process.resourcesPath);

  // 프로덕션 빌드에서는 process.resourcesPath 사용
  const getResourcePath = (relativePath: string) => {
    if (IS_DEV) {
      return path.join(__dirname, relativePath);
    }
    // 패키징된 앱에서는 app.asar.unpacked 사용
    return path.join(process.resourcesPath, "app.asar.unpacked", relativePath);
  };

  const iconPath = IS_DEV
    ? path.join(__dirname, "../build/icon.png")
    : path.join(
        process.resourcesPath,
        "app.asar.unpacked",
        "build",
        "icon.png"
      );

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: iconPath,
    webPreferences: {
      preload: IS_DEV
        ? path.join(__dirname, "preload.js")
        : path.join(
            process.resourcesPath,
            "app.asar.unpacked",
            "dist-electron",
            "preload.js"
          ),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.platform === "darwin") {
    app.dock?.setIcon(iconPath);
  }

  // 로드 이벤트 리스너 추가
  mainWindow.webContents.on("did-start-loading", () => {
    console.log("웹 콘텐츠 로딩 시작");
  });

  mainWindow.webContents.on("did-finish-load", () => {
    console.log("웹 콘텐츠 로딩 완료");
  });

  mainWindow.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription) => {
      console.error("웹 콘텐츠 로딩 실패:", errorCode, errorDescription);
    }
  );

  if (IS_DEV) {
    console.log("개발 모드: http://localhost:719 로드");
    mainWindow.loadURL("http://localhost:719");
    mainWindow.webContents.openDevTools();
  } else {
    const htmlPath = path.join(
      process.resourcesPath,
      "app.asar.unpacked",
      "out",
      "index.html"
    );
    console.log("프로덕션 모드: HTML 파일 로드");
    console.log("HTML 경로:", htmlPath);
    console.log("파일 존재 여부 확인 중...");

    // 파일 존재 확인
    const fs = require("fs");
    if (fs.existsSync(htmlPath)) {
      console.log("✓ HTML 파일 존재함");
    } else {
      console.error("✗ HTML 파일을 찾을 수 없음!");
      console.log("resourcesPath 디렉토리 내용:");
      try {
        const items = fs.readdirSync(process.resourcesPath);
        console.log(items);
      } catch (err) {
        console.error("디렉토리 읽기 실패:", err);
      }
    }

    mainWindow.loadFile(htmlPath).catch((err) => {
      console.error("파일 로드 에러:", err);
    });

    // 디버깅을 위해 임시로 개발자 도구 열기
    mainWindow.webContents.openDevTools();
  }
}

// Set application name for dev mode
if (IS_DEV) {
  app.setName("LEEDAEHYOUNG-TodoList");
}

app.whenReady().then(() => {
  console.log("=== App Ready ===");
  console.log("VAULT_ROOT:", VAULT_ROOT);

  // 프로덕션 모드에서 file:// 프로토콜의 경로 문제 해결
  if (!IS_DEV) {
    protocol.interceptFileProtocol("file", (request, callback) => {
      const url = request.url.substring(7); // 'file://' 제거
      let filePath: string;

      // 단순 절대 경로인 경우 (_next, icon.svg 등 - 전체 경로가 아님)
      if (
        url.startsWith("/") &&
        !url.includes("/Users/") &&
        !url.includes("/Applications/")
      ) {
        const outPath = path.join(
          process.resourcesPath,
          "app.asar.unpacked",
          "out"
        );
        filePath = path.normalize(path.join(outPath, url));
        console.log("프로토콜 인터셉트:", url, "->", filePath);
      } else {
        // 이미 전체 경로인 경우 그대로 사용
        filePath = path.normalize(url);
      }

      callback({ path: filePath });
    });
  }

  ensureDirs();
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// IPC Handlers
ipcMain.handle(
  "list-files",
  async (_: Electron.IpcMainInvokeEvent, folder: FolderType) => {
    await ensureDirs();
    const base = getBaseDirByFolder(folder);
    return await listFilesRecursive(base, base, folder);
  }
);

ipcMain.handle(
  "read-file",
  async (_: Electron.IpcMainInvokeEvent, vaultPath: string) => {
    await ensureDirs();
    const parts = vaultPath.split("/");
    const folder = parts[1];
    const rest = parts.slice(2);
    const base = getBaseDirByFolder(folder);
    const file = safeJoin(base, rest.join("/"));

    try {
      const stat = await fs.stat(file);
      if (stat.isDirectory()) {
        return "";
      }
      return await fs.readFile(file, "utf8");
    } catch (e) {
      console.error("Read file error:", e);
      return "";
    }
  }
);

ipcMain.handle(
  "save-file",
  async (
    _: Electron.IpcMainInvokeEvent,
    vaultPath: string,
    content: string
  ) => {
    await ensureDirs();
    const parts = vaultPath.split("/");
    const folder = parts[1];
    const rest = parts.slice(2);
    const base = getBaseDirByFolder(folder);
    const file = safeJoin(base, rest.join("/"));
    const dir = path.dirname(file);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(file, content, "utf8");
    return { ok: true };
  }
);

ipcMain.handle(
  "move-file",
  async (
    _: Electron.IpcMainInvokeEvent,
    fromVaultPath: string,
    toVaultPath: string
  ) => {
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
    const destDir = path.dirname(dest);
    await fs.mkdir(destDir, { recursive: true });
    await fs.rename(src, dest);
  }
);

ipcMain.handle(
  "create-folder",
  async (_: Electron.IpcMainInvokeEvent, vaultPath: string) => {
    await ensureDirs();
    const parts = vaultPath.split("/");
    const folder = parts[1];
    const rest = parts.slice(2);
    const base = getBaseDirByFolder(folder);
    const folderPath = safeJoin(base, rest.join("/"));
    await fs.mkdir(folderPath, { recursive: true });
  }
);

ipcMain.handle(
  "delete-path",
  async (_: Electron.IpcMainInvokeEvent, vaultPath: string) => {
    await ensureDirs();
    const parts = vaultPath.split("/");
    const folder = parts[1];
    const rest = parts.slice(2);
    const base = getBaseDirByFolder(folder);
    const targetPath = safeJoin(base, rest.join("/"));
    const stat = await fs.stat(targetPath);
    if (stat.isDirectory()) {
      await fs.rm(targetPath, { recursive: true, force: true });
    } else {
      await fs.unlink(targetPath);
    }
  }
);

ipcMain.handle(
  "rename-path",
  async (
    _: Electron.IpcMainInvokeEvent,
    fromVaultPath: string,
    newName: string
  ) => {
    await ensureDirs();
    const parts = fromVaultPath.split("/");
    const folder = parts[1];
    const rest = parts.slice(2);
    const base = getBaseDirByFolder(folder);
    const oldPath = safeJoin(base, rest.join("/"));
    const parentDir = path.dirname(oldPath);
    const newPath = path.join(parentDir, newName);
    await fs.rename(oldPath, newPath);
    const relativePath = path.relative(base, newPath);
    return `/${folder}/${relativePath.replace(/\\/g, "/")}`;
  }
);

ipcMain.handle("create-new-file", async (_: Electron.IpcMainInvokeEvent) => {
  await ensureDirs();
  const today = new Date();
  const fileName = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}.md`;
  const vaultPath = `/not-started/${fileName}`;

  // Check if file exists, if so, append number
  let finalPath = vaultPath;
  let counter = 1;
  while (true) {
    try {
      const parts = finalPath.split("/");
      const folder = parts[1];
      const rest = parts.slice(2);
      const base = getBaseDirByFolder(folder);
      const file = safeJoin(base, rest.join("/"));
      await fs.access(file);
      // File exists, try next
      finalPath = `/not-started/${fileName.replace(".md", `-${counter}.md`)}`;
      counter++;
    } catch {
      // File does not exist, use this path
      break;
    }
  }

  const parts = finalPath.split("/");
  const folder = parts[1];
  const rest = parts.slice(2);
  const base = getBaseDirByFolder(folder);
  const file = safeJoin(base, rest.join("/"));

  await fs.writeFile(file, "", "utf8");
  return { path: finalPath };
});

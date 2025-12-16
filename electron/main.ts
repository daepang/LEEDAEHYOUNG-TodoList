import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs/promises';
import isDev from 'electron-is-dev';

// Vault configuration
const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
const VAULT_ROOT = isDebug
    ? path.join(process.cwd(), 'vault')
    : path.join(app.getPath('documents'), 'LEEDAEHYOUNG-TodoList', 'vault');

const NOT_STARTED_DIR = path.join(VAULT_ROOT, 'not-started');
const IN_PROGRESS_DIR = path.join(VAULT_ROOT, 'in-progress');
const PENDING_DIR = path.join(VAULT_ROOT, 'pending');
const DONE_DIR = path.join(VAULT_ROOT, 'done');

type FolderType = 'not-started' | 'in-progress' | 'pending' | 'done';

async function ensureDirs() {
    await fs.mkdir(NOT_STARTED_DIR, { recursive: true });
    await fs.mkdir(IN_PROGRESS_DIR, { recursive: true });
    await fs.mkdir(PENDING_DIR, { recursive: true });
    await fs.mkdir(DONE_DIR, { recursive: true });
}

function getBaseDirByFolder(folder: string): string {
    switch (folder) {
        case 'not-started': return NOT_STARTED_DIR;
        case 'in-progress': return IN_PROGRESS_DIR;
        case 'pending': return PENDING_DIR;
        case 'done': return DONE_DIR;
        default: return NOT_STARTED_DIR;
    }
}

function safeJoin(base: string, p: string) {
    const target = path.normalize(path.join(base, p));
    if (!target.startsWith(base)) throw new Error('Invalid path');
    return target;
}

async function listFilesRecursive(
    dir: string,
    baseDir: string,
    folderType: FolderType
): Promise<Array<{ name: string; path: string; type?: 'file' | 'folder' }>> {
    const results: Array<{ name: string; path: string; type?: 'file' | 'folder' }> = [];
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            const relativePath = path.relative(baseDir, fullPath);
            const vaultPath = `/${folderType}/${relativePath.replace(/\\/g, '/')}`;

            if (entry.isDirectory()) {
                results.push({ name: entry.name, path: vaultPath, type: 'folder' });
                const subResults = await listFilesRecursive(fullPath, baseDir, folderType);
                results.push(...subResults);
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
                results.push({ name: entry.name, path: vaultPath, type: 'file' });
            }
        }
    } catch (error) {
        // Ignore errors (e.g., folder not found)
    }
    return results;
}

function createWindow() {
    const iconPath = path.join(__dirname, '../build/icon.png');

    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: iconPath,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    if (process.platform === 'darwin') {
        app.dock?.setIcon(iconPath);
    }

    if (isDev) {
        mainWindow.loadURL('http://localhost:719');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../out/index.html'));
    }
}

// Set application name for dev mode
// Set application name for dev mode
if (isDebug || isDev) {
    app.setName('LEEDAEHYOUNG-TodoList');
}

app.whenReady().then(() => {
    ensureDirs();
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('list-files', async (_: Electron.IpcMainInvokeEvent, folder: FolderType) => {
    await ensureDirs();
    const base = getBaseDirByFolder(folder);
    return await listFilesRecursive(base, base, folder);
});

ipcMain.handle('read-file', async (_: Electron.IpcMainInvokeEvent, vaultPath: string) => {
    await ensureDirs();
    const parts = vaultPath.split('/');
    const folder = parts[1];
    const rest = parts.slice(2);
    const base = getBaseDirByFolder(folder);
    const file = safeJoin(base, rest.join('/'));

    try {
        const stat = await fs.stat(file);
        if (stat.isDirectory()) {
            return '';
        }
        return await fs.readFile(file, 'utf8');
    } catch (e) {
        console.error('Read file error:', e);
        return '';
    }
});

ipcMain.handle('save-file', async (_: Electron.IpcMainInvokeEvent, vaultPath: string, content: string) => {
    await ensureDirs();
    const parts = vaultPath.split('/');
    const folder = parts[1];
    const rest = parts.slice(2);
    const base = getBaseDirByFolder(folder);
    const file = safeJoin(base, rest.join('/'));
    const dir = path.dirname(file);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(file, content, 'utf8');
    return { ok: true };
});

ipcMain.handle('move-file', async (_: Electron.IpcMainInvokeEvent, fromVaultPath: string, toVaultPath: string) => {
    await ensureDirs();
    const fromParts = fromVaultPath.split('/');
    const toParts = toVaultPath.split('/');
    const f1 = fromParts[1];
    const r1 = fromParts.slice(2);
    const f2 = toParts[1];
    const r2 = toParts.slice(2);
    const base1 = getBaseDirByFolder(f1);
    const base2 = getBaseDirByFolder(f2);
    const src = safeJoin(base1, r1.join('/'));
    const dest = safeJoin(base2, r2.join('/'));
    const destDir = path.dirname(dest);
    await fs.mkdir(destDir, { recursive: true });
    await fs.rename(src, dest);
});

ipcMain.handle('create-folder', async (_: Electron.IpcMainInvokeEvent, vaultPath: string) => {
    await ensureDirs();
    const parts = vaultPath.split('/');
    const folder = parts[1];
    const rest = parts.slice(2);
    const base = getBaseDirByFolder(folder);
    const folderPath = safeJoin(base, rest.join('/'));
    await fs.mkdir(folderPath, { recursive: true });
});

ipcMain.handle('delete-path', async (_: Electron.IpcMainInvokeEvent, vaultPath: string) => {
    await ensureDirs();
    const parts = vaultPath.split('/');
    const folder = parts[1];
    const rest = parts.slice(2);
    const base = getBaseDirByFolder(folder);
    const targetPath = safeJoin(base, rest.join('/'));
    const stat = await fs.stat(targetPath);
    if (stat.isDirectory()) {
        await fs.rm(targetPath, { recursive: true, force: true });
    } else {
        await fs.unlink(targetPath);
    }
});

ipcMain.handle('rename-path', async (_: Electron.IpcMainInvokeEvent, fromVaultPath: string, newName: string) => {
    await ensureDirs();
    const parts = fromVaultPath.split('/');
    const folder = parts[1];
    const rest = parts.slice(2);
    const base = getBaseDirByFolder(folder);
    const oldPath = safeJoin(base, rest.join('/'));
    const parentDir = path.dirname(oldPath);
    const newPath = path.join(parentDir, newName);
    await fs.rename(oldPath, newPath);
    const relativePath = path.relative(base, newPath);
    return `/${folder}/${relativePath.replace(/\\/g, '/')}`;
});

ipcMain.handle('create-new-file', async (_: Electron.IpcMainInvokeEvent) => {
    await ensureDirs();
    const today = new Date();
    const fileName = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}.md`;
    const vaultPath = `/not-started/${fileName}`;

    // Check if file exists, if so, append number
    let finalPath = vaultPath;
    let counter = 1;
    while (true) {
        try {
            const parts = finalPath.split('/');
            const folder = parts[1];
            const rest = parts.slice(2);
            const base = getBaseDirByFolder(folder);
            const file = safeJoin(base, rest.join('/'));
            await fs.access(file);
            // File exists, try next
            finalPath = `/not-started/${fileName.replace('.md', `-${counter}.md`)}`;
            counter++;
        } catch {
            // File does not exist, use this path
            break;
        }
    }

    const parts = finalPath.split('/');
    const folder = parts[1];
    const rest = parts.slice(2);
    const base = getBaseDirByFolder(folder);
    const file = safeJoin(base, rest.join('/'));

    await fs.writeFile(file, '', 'utf8');
    return { path: finalPath };
});

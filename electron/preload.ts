import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    listFiles: (folder: string) => ipcRenderer.invoke('list-files', folder),
    readFile: (path: string) => ipcRenderer.invoke('read-file', path),
    saveFile: (path: string, content: string) => ipcRenderer.invoke('save-file', path, content),
    moveFile: (from: string, to: string) => ipcRenderer.invoke('move-file', from, to),
    createFolder: (path: string) => ipcRenderer.invoke('create-folder', path),
    deletePath: (path: string) => ipcRenderer.invoke('delete-path', path),
    renamePath: (path: string, newName: string) => ipcRenderer.invoke('rename-path', path, newName),
    createNewFile: () => ipcRenderer.invoke('create-new-file'),
});

export { };

declare global {
    interface Window {
        electronAPI?: {
            listFiles: (folder: string) => Promise<any[]>;
            readFile: (path: string) => Promise<string>;
            saveFile: (path: string, content: string) => Promise<void>;
            moveFile: (from: string, to: string) => Promise<void>;
            createFolder: (path: string) => Promise<void>;
            deletePath: (path: string) => Promise<void>;
            renamePath: (path: string, newName: string) => Promise<string>;
            createNewFile: () => Promise<{ path: string }>;
        };
    }
}

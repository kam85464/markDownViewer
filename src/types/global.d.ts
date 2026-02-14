export interface FileItem {
  name: string;
  path: string;
  parent: string;
}

export interface IElectronAPI {
  selectFolder: () => Promise<string | null>;
  scanFolder: (path: string) => Promise<FileItem[]>;
  readFile: (path: string) => Promise<string>;
  saveFile: (path: string, content: string) => Promise<boolean>;
  getRecentFolders: () => Promise<string[]>;
  showConfirmDialog: (options: any) => Promise<number>;
}

declare global {
  interface Window {
    electron?: IElectronAPI;
  }
}
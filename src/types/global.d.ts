export interface FileItem {
  name: string;
  path: string;
  parent?: string;
  isDirectory?: boolean;
  isGithub?: boolean;
  download_url?: string;
  type?: 'file' | 'dir';
}

export interface IElectronAPI {
  selectFolder: () => Promise<string | null>;
  scanFolder: (path: string) => Promise<FileItem[]>;
  readFile: (path: string) => Promise<string>;
  saveFile: (path: string, content: string) => Promise<boolean>;
  saveFileAs: (content: string) => Promise<string | null>;
  getRecentFolders: () => Promise<string[]>;
  showConfirmDialog: (options: any) => Promise<number>;
  exportToPdf: (htmlContent: string) => Promise<boolean>;
  exportToHtml: (htmlContent: string) => Promise<boolean>;
  getSettings: () => Promise<any>;
  getSettingsSync: () => any;
  setSetting: (key: string, value: any) => Promise<boolean>;
  resetSettings: () => Promise<boolean>;
  openSettingsInEditor: () => Promise<boolean>;
  getSystemInfo: () => Promise<{ appVersion: string; electronVersion: string; nodeVersion: string; platform: string; arch: string }>;
}

declare global {
  interface Window {
    electron?: IElectronAPI;
    MonacoEnvironment?: {
      getWorker(workerId: string, label: string): Worker;
    };
  }
}

declare module 'monaco-vim' {
  export function initVimMode(editor: any, statusbar: HTMLElement | null): any;
}
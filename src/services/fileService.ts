import { FileItem } from '../types/global';

export const fileService = {
  selectFolder: async (): Promise<string | null> => {
    if (window.electron) {
      return await window.electron.selectFolder();
    }
    console.warn('Electron API is not available in the browser.');
    return null;
  },
  scanFolder: async (path: string): Promise<FileItem[]> => {
    if (window.electron) {
      return await window.electron.scanFolder(path);
    }
    return [];
  },
  readFile: async (path: string): Promise<string> => {
    if (window.electron) {
      try {
        return await window.electron.readFile(path);
      } catch (e) {
        console.error("File read error:", e);
        throw e;
      }
    }
    return '';
  },
  saveFile: async (path: string, content: string): Promise<boolean> => {
    if (window.electron) {
      return await window.electron.saveFile(path, content);
    }
    return false;
  },
  saveFileAs: async (content: string): Promise<string | null> => {
    if (window.electron) {
      return await window.electron.saveFileAs(content);
    }
    return null;
  },
  getRecentFolders: async (): Promise<string[]> => {
    if (window.electron) {
      return await window.electron.getRecentFolders();
    }
    return [];
  },
  showConfirmDialog: async (options: any): Promise<number> => {
    if (window.electron) {
      return await window.electron.showConfirmDialog(options);
    }
    // Fallback for browser
    const result = window.confirm(options.message);
    return result ? 0 : 1;
  },
  exportToPdf: async (htmlContent: string): Promise<boolean> => {
    if (window.electron) {
      return await window.electron.exportToPdf(htmlContent);
    }
    return false;
  }
};
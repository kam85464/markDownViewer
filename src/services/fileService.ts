// src/services/fileService.ts

export interface FileItem {
  name: string;
  path: string;
  parent: string;
  isDirectory: boolean;
}

export interface IFileService {
  selectFolder(): Promise<string | null>;
  scanFolder(path: string): Promise<FileItem[]>;
  readFile(path: string): Promise<string>;
  saveFile(path: string, content: string): Promise<void>;
  getRecentFolders(): Promise<string[]>;
  showConfirmDialog(options: { type: string; buttons: string[]; title: string; message: string; detail?: string }): Promise<number>;
  saveFileAs(content: string): Promise<string | null>;
  exportToPdf(html: string): Promise<void>;
  exportToHtml(html: string): Promise<void>;
  showItemInFolder(path: string): Promise<void>;
}

class ElectronFileService implements IFileService {
  private ipcRenderer: any;

  constructor() {
    if (window.require) {
      const electron = window.require('electron');
      this.ipcRenderer = electron.ipcRenderer;
    }
  }

  async selectFolder(): Promise<string | null> {
    return await this.ipcRenderer.invoke('select-folder');
  }

  async scanFolder(path: string): Promise<FileItem[]> {
    return await this.ipcRenderer.invoke('scan-folder', path);
  }

  async readFile(path: string): Promise<string> {
    return await this.ipcRenderer.invoke('read-file', path);
  }

  async saveFile(path: string, content: string): Promise<void> {
    return await this.ipcRenderer.invoke('save-file', { filePath: path, content });
  }

  async getRecentFolders(): Promise<string[]> {
    return await this.ipcRenderer.invoke('get-recent-folders');
  }

  async showConfirmDialog(options: any): Promise<number> {
    return await this.ipcRenderer.invoke('show-confirm-dialog', options);
  }

  async saveFileAs(content: string): Promise<string | null> {
    return await this.ipcRenderer.invoke('save-file-as', content);
  }

  async exportToPdf(html: string): Promise<void> {
    return await this.ipcRenderer.invoke('export-pdf', html);
  }

  async exportToHtml(html: string): Promise<void> {
    return await this.ipcRenderer.invoke('export-html', html);
  }

  async showItemInFolder(path: string): Promise<void> {
    return await this.ipcRenderer.invoke('show-item-in-folder', path);
  }
}

class BrowserFileService implements IFileService {
  private directoryHandle: FileSystemDirectoryHandle | null = null;
  private fileHandles: Map<string, FileSystemFileHandle> = new Map();
  private fallbackFiles: Map<string, File> = new Map();

  async getRecentFolders(): Promise<string[]> {
    try {
      const recent = localStorage.getItem('recentFolders');
      return recent ? JSON.parse(recent) : [];
    } catch {
      return [];
    }
  }

  private addToRecentFolders(path: string) {
    try {
      const recent = localStorage.getItem('recentFolders');
      let folders: string[] = recent ? JSON.parse(recent) : [];
      folders = folders.filter(f => f !== path);
      folders.unshift(path);
      folders = folders.slice(0, 10);
      localStorage.setItem('recentFolders', JSON.stringify(folders));
    } catch (e) {
      console.error('Failed to save recent folders', e);
    }
  }

  async selectFolder(): Promise<string | null> {
    if ('showDirectoryPicker' in window) {
      try {
        // @ts-ignore - File System Access API types might be missing
        this.directoryHandle = await window.showDirectoryPicker();
        this.fileHandles.clear();
        this.fallbackFiles.clear();
        const name = this.directoryHandle ? this.directoryHandle.name : null;
        if (name) this.addToRecentFolders(name);
        return name;
      } catch (error) {
        console.error('Browser folder selection cancelled or failed', error);
        return null;
      }
    } else {
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        // @ts-ignore
        input.webkitdirectory = true;
        input.onchange = (e: any) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            this.directoryHandle = null;
            this.fileHandles.clear();
            this.fallbackFiles.clear();
            const rootName = files[0].webkitRelativePath.split('/')[0];
            Array.from(files).forEach((file: any) => {
              this.fallbackFiles.set(file.webkitRelativePath, file);
            });
            this.addToRecentFolders(rootName);
            resolve(rootName);
          } else {
            resolve(null);
          }
        };
        input.click();
      });
    }
  }

  async scanFolder(path: string): Promise<FileItem[]> {
    const files: FileItem[] = [];

    if (this.directoryHandle) {
      const scan = async (dirHandle: FileSystemDirectoryHandle, currentPath: string) => {
        // @ts-ignore
        for await (const entry of dirHandle.values()) {
          const entryPath = `${currentPath}/${entry.name}`;
          if (entry.kind === 'file') {
            if (entry.name.toLowerCase().endsWith('.md') || entry.name.toLowerCase().endsWith('.markdown')) {
              this.fileHandles.set(entryPath, entry as FileSystemFileHandle);
              files.push({
                name: entry.name,
                path: entryPath,
                parent: currentPath,
                isDirectory: false
              });
            }
          } else if (entry.kind === 'directory') {
            if (entry.name !== 'node_modules' && entry.name !== '.git') {
              await scan(entry as FileSystemDirectoryHandle, entryPath);
            }
          }
        }
      };
      await scan(this.directoryHandle, path);
    } else if (this.fallbackFiles.size > 0) {
      this.fallbackFiles.forEach((file, relPath) => {
        const parts = relPath.split('/');
        if (parts.includes('node_modules') || parts.includes('.git')) return;

        if (relPath.startsWith(path) && (file.name.toLowerCase().endsWith('.md') || file.name.toLowerCase().endsWith('.markdown'))) {
          const parent = parts.slice(0, -1).join('/');
          files.push({
            name: file.name,
            path: relPath,
            parent: parent,
            isDirectory: false
          });
        }
      });
    }
    
    return files;
  }

  async readFile(path: string): Promise<string> {
    if (this.directoryHandle) {
      const handle = this.fileHandles.get(path);
      if (!handle) throw new Error(`File not found: ${path}`);
      const file = await handle.getFile();
      return await file.text();
    } else {
      const file = this.fallbackFiles.get(path);
      if (!file) throw new Error(`File not found: ${path}`);
      return await file.text();
    }
  }

  async saveFileAs(content: string): Promise<string | null> {
    return null;
  }
  
  async saveFile(path: string, content: string): Promise<void> {
    if (this.directoryHandle) {
      const handle = this.fileHandles.get(path);
      if (!handle) throw new Error(`File not found: ${path}`);
      // @ts-ignore
      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();
    } else {
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = path.split('/').pop() || 'document.md';
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  async showConfirmDialog(options: any): Promise<number> {
    // Returns 0 for Yes (first button), 1 for No (second button)
    const result = window.confirm(`${options.message}\n${options.detail || ''}`);
    return result ? 0 : 1;
  }

  async exportToPdf(html: string): Promise<void> {
    window.print();
  }

  async exportToHtml(html: string): Promise<void> {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.html';
    a.click();
    URL.revokeObjectURL(url);
  }

  async showItemInFolder(path: string): Promise<void> {
    console.warn('Show item in folder is not supported in browser mode.');
  }
}

// Factory to determine environment
const isElectron = () => {
  return typeof window !== 'undefined' && 
         window.process && 
         window.process.type === 'renderer';
};

export const fileService = isElectron() ? new ElectronFileService() : new BrowserFileService();

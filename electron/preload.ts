import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  scanFolder: (path: string) => ipcRenderer.invoke('scan-folder', path),
  readFile: (path: string) => ipcRenderer.invoke('read-file', path),
  saveFile: (path: string, content: string) => ipcRenderer.invoke('save-file', { filePath: path, content }),
  getRecentFolders: () => ipcRenderer.invoke('get-recent-folders'),
  showConfirmDialog: (options: any) => ipcRenderer.invoke('show-confirm-dialog', options),
})
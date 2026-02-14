import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  scanFolder: (path: string) => ipcRenderer.invoke('scan-folder', path),
  readFile: (path: string) => ipcRenderer.invoke('read-file', path),
  saveFile: (path: string, content: string) => ipcRenderer.invoke('save-file', { filePath: path, content }),
  saveFileAs: (content: string) => ipcRenderer.invoke('save-file-as', content),
  getRecentFolders: () => ipcRenderer.invoke('get-recent-folders'),
  showConfirmDialog: (options: any) => ipcRenderer.invoke('show-confirm-dialog', options),
  exportToPdf: (htmlContent: string) => ipcRenderer.invoke('export-pdf', htmlContent),
  exportToHtml: (htmlContent: string) => ipcRenderer.invoke('export-html', htmlContent),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  setSetting: (key: string, value: any) => ipcRenderer.invoke('set-setting', key, value),
  resetSettings: () => ipcRenderer.invoke('reset-settings'),
  openSettingsInEditor: () => ipcRenderer.invoke('open-settings-editor'),
})
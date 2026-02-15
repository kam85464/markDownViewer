"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electron", {
  selectFolder: () => electron.ipcRenderer.invoke("select-folder"),
  scanFolder: (path) => electron.ipcRenderer.invoke("scan-folder", path),
  readFile: (path) => electron.ipcRenderer.invoke("read-file", path),
  saveFile: (path, content) => electron.ipcRenderer.invoke("save-file", { filePath: path, content }),
  saveFileAs: (content) => electron.ipcRenderer.invoke("save-file-as", content),
  getRecentFolders: () => electron.ipcRenderer.invoke("get-recent-folders"),
  showConfirmDialog: (options) => electron.ipcRenderer.invoke("show-confirm-dialog", options),
  exportToPdf: (htmlContent) => electron.ipcRenderer.invoke("export-pdf", htmlContent),
  exportToHtml: (htmlContent) => electron.ipcRenderer.invoke("export-html", htmlContent),
  getSettings: () => electron.ipcRenderer.invoke("get-settings"),
  setSetting: (key, value) => electron.ipcRenderer.invoke("set-setting", key, value),
  resetSettings: () => electron.ipcRenderer.invoke("reset-settings"),
  openSettingsInEditor: () => electron.ipcRenderer.invoke("open-settings-editor")
});

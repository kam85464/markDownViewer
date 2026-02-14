import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import fs from 'fs'
import Store from 'electron-store'

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
const store = new Store();

function createWindow() {
  const bounds = store.get('bounds') as { width: number; height: number; x: number; y: number } | undefined;

  win = new BrowserWindow({
    width: bounds?.width || 1200,
    height: bounds?.height || 800,
    x: bounds?.x,
    y: bounds?.y,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: 'hiddenInset',
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }

  win.on('close', () => {
    if (win) store.set('bounds', win.getBounds());
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)

// --- IPC Handlers ---

// 1. Select Folder
ipcMain.handle('select-folder', async () => {
  if (!win) return null;
  const result = await dialog.showOpenDialog(win, {
    properties: ['openDirectory'],
    defaultPath: store.get('lastOpenedFolder') as string | undefined
  });
  if (result.canceled) return null;
  const folderPath = result.filePaths[0];
  store.set('lastOpenedFolder', folderPath);
  
  const recent = (store.get('recentFolders') as string[]) || [];
  const newRecent = [folderPath, ...recent.filter(p => p !== folderPath)].slice(0, 10);
  store.set('recentFolders', newRecent);
  return folderPath;
});

// 2. Scan Files (Recursive)
const getMarkdownFiles = (dir: string, fileList: any[] = []) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && !file.startsWith('.')) {
        getMarkdownFiles(filePath, fileList);
      }
    } else {
      if (file.endsWith('.md') || file.endsWith('.markdown')) {
        fileList.push({
          name: file,
          path: filePath,
          parent: path.basename(dir)
        });
      }
    }
  });
  return fileList;
};

ipcMain.handle('scan-folder', async (_, folderPath: string) => {
  return getMarkdownFiles(folderPath);
});

ipcMain.handle('get-recent-folders', async () => {
  return (store.get('recentFolders') as string[]) || [];
});

ipcMain.handle('show-confirm-dialog', async (_, options) => {
  if (!win) return 0;
  const result = await dialog.showMessageBox(win, options);
  return result.response;
});

// 3. Read/Write
ipcMain.handle('read-file', async (_, filePath: string) => {
  return fs.readFileSync(filePath, 'utf-8');
});

ipcMain.handle('save-file', async (_, { filePath, content }) => {
  fs.writeFileSync(filePath, content, 'utf-8');
  return true;
});
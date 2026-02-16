import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import fs from 'fs'
import Store from 'electron-store'
import crypto from 'crypto'

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
const store = new Store();

// Initialize User ID if not present
if (!store.get('userId')) {
  const userId = 'USER-' + crypto.randomBytes(4).toString('hex').toUpperCase();
  store.set('userId', userId);
  store.set('registeredAt', new Date().toISOString());
}

function createWindow() {
  const bounds = store.get('bounds') as { width: number; height: number; x: number; y: number } | undefined;

  win = new BrowserWindow({
    width: bounds?.width || 1200,
    height: bounds?.height || 800,
    x: bounds?.x || undefined,
    y: bounds?.y || undefined,
    webPreferences: {
      preload: path.resolve(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: 'hiddenInset',
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(process.env.DIST || '', 'index.html'))
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

ipcMain.handle('save-file-as', async (_, content: string) => {
  if (!win) return null;
  const { filePath } = await dialog.showSaveDialog(win, {
    title: 'Save Markdown As',
    filters: [{ name: 'Markdown', extensions: ['md', 'markdown'] }]
  });
  if (filePath) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return filePath;
  }
  return null;
});

ipcMain.handle('export-pdf', async (_, htmlContent: string) => {
  if (!win) return false;

  const { filePath } = await dialog.showSaveDialog(win, {
    title: 'Export to PDF',
    filters: [{ name: 'PDF', extensions: ['pdf'] }]
  });

  if (!filePath) return false;

  const pdfWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.0/github-markdown-light.min.css">
        <style>
          body { margin: 0; padding: 40px; }
          .markdown-body { box-sizing: border-box; min-width: 200px; max-width: 980px; margin: 0 auto; }
        </style>
      </head>
      <body class="markdown-body">
        ${htmlContent}
      </body>
    </html>
  `;

  await pdfWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(fullHtml)}`);
  
  const pdfData = await pdfWindow.webContents.printToPDF({});
  fs.writeFileSync(filePath, pdfData);
  pdfWindow.close();
  return true;
});

ipcMain.handle('export-html', async (_, htmlContent: string) => {
  if (!win) return false;

  const { filePath } = await dialog.showSaveDialog(win, {
    title: 'Export to HTML',
    filters: [{ name: 'HTML', extensions: ['html'] }]
  });

  if (!filePath) return false;

  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Exported Markdown</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.0/github-markdown-light.min.css">
        <style>
          body { margin: 0; padding: 40px; background-color: #ffffff; }
          .markdown-body { box-sizing: border-box; min-width: 200px; max-width: 980px; margin: 0 auto; }
          @media (prefers-color-scheme: dark) {
            body { background-color: #0d1117; }
            .markdown-body { color: #c9d1d9; }
          }
        </style>
      </head>
      <body class="markdown-body">
        ${htmlContent}
      </body>
    </html>
  `;

  fs.writeFileSync(filePath, fullHtml, 'utf-8');
  return true;
});

// Settings Management - IPC Handlers
ipcMain.handle('get-settings', async () => {
  return store.store;
});

ipcMain.on('get-settings-sync', (event) => {
  event.returnValue = store.store;
});

ipcMain.handle('set-setting', async (_, key: string, value: any) => {
  store.set(key, value);
  return true;
});

ipcMain.handle('reset-settings', async () => {
  store.clear();
  return true;
});

ipcMain.handle('open-settings-editor', async () => {
  store.openInEditor();
  return true;
});

ipcMain.handle('get-system-info', async () => {
  return {
    appVersion: app.getVersion(),
    electronVersion: process.versions.electron,
    nodeVersion: process.versions.node,
    platform: process.platform,
    arch: process.arch
  };
});
import { create } from 'zustand';
import { FileItem } from '../types/global';
import { Plugin } from '../types/plugin';
import { fileService } from '../services/fileService';
import { formatMarkdown } from '../services/markdownService';
import { settingsService } from '../services/settingsService';

interface AppState {
  currentFolder: string | null;
  files: FileItem[];
  openFiles: FileItem[];
  currentFile: FileItem | null;
  markdownContent: string;
  isEditing: boolean;
  isDarkMode: boolean;
  originalContent: string;
  recentFolders: string[];
  cursorPosition: { line: number; column: number };
  findTrigger: number;
  isDistractionFreeMode: boolean;
  isTypewriterMode: boolean;
  autoSaveEnabled: boolean;
  isVimMode: boolean;
  theme: string;
  showPlugins: boolean;
  plugins: Plugin[];
  splitDirection: 'vertical' | 'horizontal';
  showTOC: boolean;
  showMinimap: boolean;
  isSyncScroll: boolean;
  wordWrap: boolean;
  showSettings: boolean;
  customCSS: string;
  fontSize: number;
  
  setFolder: (folder: string) => void;
  setFiles: (files: FileItem[]) => void;
  selectFile: (file: FileItem) => void;
  setMarkdownContent: (content: string) => void;
  toggleEditMode: () => void;
  toggleDarkMode: () => void;
  loadFileContent: (path: string) => Promise<void>;
  saveCurrentFile: () => Promise<void>;
  saveAs: () => Promise<void>;
  loadRecentFolders: () => Promise<void>;
  closeFile: (path: string) => Promise<void>;
  closeOthers: (path: string) => Promise<void>;
  closeToRight: (path: string) => Promise<void>;
  closeFolder: () => void;
  setCursorPosition: (line: number, column: number) => void;
  triggerFind: () => void;
  toggleDistractionFreeMode: () => void;
  toggleTypewriterMode: () => void;
  toggleAutoSave: () => void;
  toggleVimMode: () => void;
  togglePluginsModal: () => void;
  enablePlugin: (id: string) => void;
  disablePlugin: (id: string) => void;
  toggleSplitDirection: () => void;
  toggleTOC: () => void;
  toggleMinimap: () => void;
  toggleSyncScroll: () => void;
  setTheme: (theme: string) => void;
  toggleWordWrap: () => void;
  toggleSettings: () => void;
  formatCurrentFile: () => Promise<void>;
  setCustomCSS: (css: string) => void;
  setFontSize: (size: number) => void;
  openSettingsFile: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentFolder: null,
  files: [],
  openFiles: [],
  currentFile: null,
  markdownContent: '',
  isEditing: false,
  isDarkMode: true,
  originalContent: '',
  recentFolders: [],
  cursorPosition: { line: 1, column: 1 },
  findTrigger: 0,
  isDistractionFreeMode: false,
  isTypewriterMode: false,
  autoSaveEnabled: settingsService.get('autoSaveEnabled'),
  isVimMode: false,
  theme: 'vs-dark',
  showPlugins: false,
  plugins: [
    { id: 'core-markdown', name: 'Core Markdown', description: 'Basic markdown support', version: '1.0.0', author: 'System', enabled: true },
    { id: 'mermaid', name: 'Mermaid Diagrams', description: 'Render Mermaid diagrams', version: '1.0.0', author: 'System', enabled: true },
    { id: 'katex', name: 'KaTeX Math', description: 'Render math equations', version: '1.0.0', author: 'System', enabled: true },
    { id: 'plantuml', name: 'PlantUML', description: 'Render PlantUML diagrams', version: '1.0.0', author: 'System', enabled: true },
    { id: 'community-theme-pack', name: 'Community Themes', description: 'Additional editor themes (Demo)', version: '0.1.0', author: 'Community', enabled: true },
  ],
  splitDirection: 'vertical',
  showTOC: true,
  showMinimap: false,
  isSyncScroll: true,
  wordWrap: true,
  showSettings: false,
  customCSS: settingsService.get('customCSS'),
  fontSize: settingsService.get('fontSize'),

  setFolder: (folder) => set({ currentFolder: folder }),
  setFiles: (files) => set({ files }),
  
  selectFile: async (file) => {
    const { currentFile, markdownContent, originalContent, openFiles } = get();
    
    // Check for unsaved changes if switching files
    if (currentFile && currentFile.path !== file.path && markdownContent !== originalContent) {
      const response = await fileService.showConfirmDialog({
        type: 'question',
        buttons: ['Save', 'Discard', 'Cancel'],
        title: 'Unsaved Changes',
        message: `Do you want to save changes to ${currentFile.name}?`,
        detail: 'Your changes will be lost if you do not save them.'
      });
      
      if (response === 2) return; // Cancel
      if (response === 0) {
        await get().saveCurrentFile();
      }
    }

    if (!openFiles.some(f => f.path === file.path)) {
      set({ openFiles: [...openFiles, file] });
    }
    set({ currentFile: file });
    await get().loadFileContent(file.path);
  },

  setMarkdownContent: (content) => set({ markdownContent: content }),
  
  toggleEditMode: () => set((state) => ({ isEditing: !state.isEditing })),
  
  toggleDarkMode: () => set((state) => {
    const nextMode = !state.isDarkMode;
    const nextTheme = nextMode ? 'vs-dark' : 'light';
    
    if (nextMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    return { isDarkMode: nextMode, theme: nextTheme };
  }),

  loadFileContent: async (path) => {
    try {
      const content = await fileService.readFile(path);
      set({ markdownContent: content, originalContent: content, cursorPosition: { line: 1, column: 1 } });
    } catch (error) {
      console.error("Failed to load file content:", error);
      set({ markdownContent: "# Error\nFailed to load file content.", originalContent: "" });
    }
  },

  saveCurrentFile: async () => {
    const { currentFile, markdownContent } = get();
    if (currentFile) {
      await fileService.saveFile(currentFile.path, markdownContent);
      set({ originalContent: markdownContent });
    }
  },

  saveAs: async () => {
    const { markdownContent, currentFolder, setFiles, currentFile, files } = get();
    const newPath = await (fileService.saveFileAs ? fileService.saveFileAs(markdownContent) : Promise.resolve(null));
    if (newPath) {
      // If we have a folder open, rescan to see if the new file is in it
      if (currentFolder) {
        const files = await fileService.scanFolder(currentFolder);
        set({ files });
        const newFile = files.find(f => f.path === newPath);
        if (newFile) {
          set({ currentFile: newFile });
        }
      }
      set({ originalContent: markdownContent });
    }
  },

  loadRecentFolders: async () => {
    const folders = await fileService.getRecentFolders();
    set({ recentFolders: folders });
  },

  closeFile: async (path) => {
    const { currentFile, markdownContent, originalContent, openFiles } = get();
    
    // If closing the active file and it has changes
    if (currentFile?.path === path && markdownContent !== originalContent) {
      const response = await fileService.showConfirmDialog({
        type: 'question',
        buttons: ['Save', 'Discard', 'Cancel'],
        title: 'Unsaved Changes',
        message: `Do you want to save changes to ${currentFile.name}?`,
        detail: 'Your changes will be lost if you do not save them.'
      });
      
      if (response === 2) return; // Cancel
      if (response === 0) {
        await get().saveCurrentFile();
      }
    }

    const newOpenFiles = openFiles.filter(f => f.path !== path);
    set({ openFiles: newOpenFiles });

    if (currentFile?.path === path) {
      if (newOpenFiles.length > 0) {
        // Select the previous file in the list or the first one
        const index = openFiles.findIndex(f => f.path === path);
        const nextFile = newOpenFiles[Math.max(0, index - 1)];
        set({ currentFile: nextFile });
        await get().loadFileContent(nextFile.path);
      } else {
        set({ currentFile: null, markdownContent: '', originalContent: '' });
      }
    }
  },

  closeOthers: async (path) => {
    const { currentFile, markdownContent, originalContent, openFiles } = get();
    const targetFile = openFiles.find(f => f.path === path);
    if (!targetFile) return;

    // If current file is NOT the target file (meaning current file will be closed)
    if (currentFile && currentFile.path !== path && markdownContent !== originalContent) {
      const response = await fileService.showConfirmDialog({
        type: 'question',
        buttons: ['Save', 'Discard', 'Cancel'],
        title: 'Unsaved Changes',
        message: `Do you want to save changes to ${currentFile.name}?`,
        detail: 'Your changes will be lost if you do not save them.'
      });
      
      if (response === 2) return; // Cancel
      if (response === 0) await get().saveCurrentFile();
    }

    set({ openFiles: [targetFile] });
    
    if (currentFile?.path !== path) {
      set({ currentFile: targetFile });
      await get().loadFileContent(targetFile.path);
    }
  },

  closeToRight: async (path) => {
    const { currentFile, markdownContent, originalContent, openFiles } = get();
    const index = openFiles.findIndex(f => f.path === path);
    if (index === -1) return;

    const filesToClose = openFiles.slice(index + 1);
    if (filesToClose.length === 0) return;

    const isCurrentClosing = filesToClose.some(f => f.path === currentFile?.path);

    if (isCurrentClosing && currentFile && markdownContent !== originalContent) {
      const response = await fileService.showConfirmDialog({
        type: 'question',
        buttons: ['Save', 'Discard', 'Cancel'],
        title: 'Unsaved Changes',
        message: `Do you want to save changes to ${currentFile.name}?`,
        detail: 'Your changes will be lost if you do not save them.'
      });
      
      if (response === 2) return; // Cancel
      if (response === 0) await get().saveCurrentFile();
    }

    const newOpenFiles = openFiles.slice(0, index + 1);
    set({ openFiles: newOpenFiles });

    if (isCurrentClosing) {
      const newCurrent = newOpenFiles[newOpenFiles.length - 1];
      set({ currentFile: newCurrent });
      await get().loadFileContent(newCurrent.path);
    }
  },

  closeFolder: () => set({
    currentFolder: null,
    files: [],
    openFiles: [],
    currentFile: null,
    markdownContent: '',
    originalContent: '',
    isEditing: false
  }),

  setCursorPosition: (line, column) => set({ cursorPosition: { line, column } }),

  triggerFind: () => set((state) => ({ findTrigger: state.findTrigger + 1 })),

  toggleDistractionFreeMode: () => set((state) => ({ isDistractionFreeMode: !state.isDistractionFreeMode })),

  toggleTypewriterMode: () => set((state) => ({ isTypewriterMode: !state.isTypewriterMode })),

  toggleAutoSave: () => set((state) => {
    const newValue = !state.autoSaveEnabled;
    settingsService.set('autoSaveEnabled', newValue);
    return { autoSaveEnabled: newValue };
  }),

  toggleVimMode: () => set((state) => ({ isVimMode: !state.isVimMode })),

  togglePluginsModal: () => set((state) => ({ showPlugins: !state.showPlugins })),

  enablePlugin: (id) => set((state) => ({
    plugins: state.plugins.map(p => p.id === id ? { ...p, enabled: true } : p)
  })),

  disablePlugin: (id) => set((state) => ({
    plugins: state.plugins.map(p => p.id === id ? { ...p, enabled: false } : p)
  })),

  toggleSplitDirection: () => set((state) => ({ splitDirection: state.splitDirection === 'vertical' ? 'horizontal' : 'vertical' })),

  toggleTOC: () => set((state) => ({ showTOC: !state.showTOC })),

  toggleMinimap: () => set((state) => ({ showMinimap: !state.showMinimap })),

  toggleSyncScroll: () => set((state) => ({ isSyncScroll: !state.isSyncScroll })),

  setTheme: (theme) => set(() => {
    const isDark = theme !== 'light';
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    return { theme, isDarkMode: isDark };
  }),

  toggleWordWrap: () => set((state) => ({ wordWrap: !state.wordWrap })),

  toggleSettings: () => set((state) => ({ showSettings: !state.showSettings })),

  formatCurrentFile: async () => {
    const { markdownContent } = get();
    if (!markdownContent) return;
    const formatted = await formatMarkdown(markdownContent);
    set({ markdownContent: formatted });
  },

  setCustomCSS: (css) => {
    settingsService.set('customCSS', css);
    set({ customCSS: css });
  },

  setFontSize: (size) => {
    settingsService.set('fontSize', size);
    set({ fontSize: size });
  },

  openSettingsFile: async () => {
    await settingsService.openInEditor();
  },
}));
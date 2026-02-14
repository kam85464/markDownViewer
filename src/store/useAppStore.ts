import { create } from 'zustand';
import { FileItem } from '../types/global';
import { fileService } from '../services/fileService';

interface AppState {
  currentFolder: string | null;
  files: FileItem[];
  currentFile: FileItem | null;
  markdownContent: string;
  isEditing: boolean;
  isDarkMode: boolean;
  originalContent: string;
  recentFolders: string[];
  cursorPosition: { line: number; column: number };
  
  setFolder: (folder: string) => void;
  setFiles: (files: FileItem[]) => void;
  selectFile: (file: FileItem) => void;
  setMarkdownContent: (content: string) => void;
  toggleEditMode: () => void;
  toggleDarkMode: () => void;
  loadFileContent: (path: string) => Promise<void>;
  saveCurrentFile: () => Promise<void>;
  loadRecentFolders: () => Promise<void>;
  closeFolder: () => void;
  setCursorPosition: (line: number, column: number) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentFolder: null,
  files: [],
  currentFile: null,
  markdownContent: '',
  isEditing: false,
  isDarkMode: true,
  originalContent: '',
  recentFolders: [],
  cursorPosition: { line: 1, column: 1 },

  setFolder: (folder) => set({ currentFolder: folder }),
  setFiles: (files) => set({ files }),
  
  selectFile: async (file) => {
    set({ currentFile: file });
    await get().loadFileContent(file.path);
  },

  setMarkdownContent: (content) => set({ markdownContent: content }),
  
  toggleEditMode: () => set((state) => ({ isEditing: !state.isEditing })),
  
  toggleDarkMode: () => set((state) => {
    const next = !state.isDarkMode;
    if (next) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    return { isDarkMode: next };
  }),

  loadFileContent: async (path) => {
    const content = await fileService.readFile(path);
    set({ markdownContent: content, originalContent: content, cursorPosition: { line: 1, column: 1 } });
  },

  saveCurrentFile: async () => {
    const { currentFile, markdownContent } = get();
    if (currentFile) {
      await fileService.saveFile(currentFile.path, markdownContent);
      set({ originalContent: markdownContent });
    }
  },

  loadRecentFolders: async () => {
    const folders = await fileService.getRecentFolders();
    set({ recentFolders: folders });
  },

  closeFolder: () => set({
    currentFolder: null,
    files: [],
    currentFile: null,
    markdownContent: '',
    originalContent: '',
    isEditing: false
  }),

  setCursorPosition: (line, column) => set({ cursorPosition: { line, column } })
}));
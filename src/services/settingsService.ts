export interface Settings {
  customCSS: string;
  autoSaveEnabled: boolean;
  theme: string;
  isVimMode: boolean;
  showMinimap: boolean;
  isSyncScroll: boolean;
  isTypewriterMode: boolean;
  wordWrap: boolean;
  fontSize: number;
}

const defaults: Settings = {
  customCSS: '',
  autoSaveEnabled: false,
  theme: 'vs-dark',
  isVimMode: false,
  showMinimap: false,
  isSyncScroll: true,
  isTypewriterMode: false,
  wordWrap: true,
  fontSize: 14,
};

// Cache for settings (populated on demand)
const settingsCache = new Map<string, any>();
let cacheInitialized = false;

// Detect if we're in Electron renderer process
const isElectron = () => {
  return typeof window !== 'undefined' && 
         window.process && 
         window.process.type === 'renderer';
};

// Initialize cache from IPC or defaults
const initCache = async () => {
  if (cacheInitialized) return;
  
  try {
    if (isElectron() && window.electron) {
      // In Electron renderer - get all settings from main process
      const allSettings = await (window as any).electron.getSettings?.();
      if (allSettings) {
        Object.entries(allSettings).forEach(([key, value]) => {
          settingsCache.set(key, value);
        });
      }
    }
  } catch (e) {
    console.warn('Failed to initialize settings cache:', e);
  }
  
  // Set defaults for any missing settings
  Object.entries(defaults).forEach(([key, value]) => {
    if (!settingsCache.has(key)) {
      settingsCache.set(key, value);
    }
  });
  
  cacheInitialized = true;
};

export const settingsService = {
  get: <K extends keyof Settings>(key: K): Settings[K] => {
    // Return from cache if available, otherwise return default
    if (settingsCache.has(key)) {
      return settingsCache.get(key);
    }
    return defaults[key];
  },

  set: async <K extends keyof Settings>(key: K, value: Settings[K]) => {
    // Update cache immediately
    settingsCache.set(key, value);
    
    // Persist to main process if in Electron
    if (isElectron() && window.electron) {
      try {
        await (window as any).electron.setSetting?.(key, value);
      } catch (e) {
        console.error(`Failed to save setting ${key}:`, e);
      }
    }
  },

  reset: async () => {
    settingsCache.clear();
    if (isElectron() && window.electron) {
      try {
        await (window as any).electron.resetSettings?.();
      } catch (e) {
        console.error('Failed to reset settings:', e);
      }
    }
  },

  openInEditor: async () => {
    if (isElectron() && window.electron) {
      try {
        await (window as any).electron.openSettingsInEditor?.();
      } catch (e) {
        console.error('Failed to open settings in editor:', e);
      }
    }
  },

  // Initialize cache on first call
  _init: initCache,
};
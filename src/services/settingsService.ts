class SettingsService {
  private settings: any = {};

  constructor() {
    this.load();
  }

  load() {
    if (typeof window !== 'undefined' && window.electron) {
      try {
        this.settings = window.electron.getSettingsSync();
      } catch (e) {
        console.error("Failed to load settings sync:", e);
        this.settings = {};
      }
    }
  }

  get(key: string): any {
    return this.settings[key];
  }

  set(key: string, value: any): void {
    this.settings[key] = value;
    if (typeof window !== 'undefined' && window.electron) {
      window.electron.setSetting(key, value).catch(console.error);
    }
  }

  getUserId(): string {
    return this.settings.userId || 'GUEST-USER';
  }

  async openInEditor() {
     if (typeof window !== 'undefined' && window.electron) {
         await window.electron.openSettingsInEditor();
     }
  }
}

export const settingsService = new SettingsService();
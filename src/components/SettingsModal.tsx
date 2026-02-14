import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { X, Settings, Check, Keyboard, Map, Link2, AlignVerticalJustifyCenter, Palette } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { 
    showSettings, 
    toggleSettings, 
    theme, 
    setTheme, 
    isVimMode, 
    toggleVimMode,
    showMinimap,
    toggleMinimap,
    isSyncScroll,
    toggleSyncScroll,
    isTypewriterMode,
    toggleTypewriterMode,
    plugins
  } = useAppStore();

  if (!showSettings) return null;

  const availableThemes = [
    { id: 'light', name: 'GitHub Light' },
    { id: 'vs-dark', name: 'GitHub Dark' },
  ];

  if (plugins.find(p => p.id === 'community-theme-pack' && p.enabled)) {
    availableThemes.push(
      { id: 'dracula', name: 'Dracula' },
      { id: 'nord', name: 'Nord' }
    );
  }

  const ToggleItem = ({ label, icon: Icon, value, onChange, description }: any) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 mb-2">
      <div className="flex items-center">
        <div className="p-2 bg-white dark:bg-gray-800 rounded-md mr-3 text-gray-500 dark:text-gray-400">
          <Icon size={18} />
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">{label}</div>
          {description && <div className="text-xs text-gray-500 dark:text-gray-400">{description}</div>}
        </div>
      </div>
      <button
        onClick={onChange}
        className={`w-10 h-6 rounded-full transition-colors relative ${value ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
      >
        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${value ? 'translate-x-4' : ''}`} />
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[500px] max-h-[80vh] flex flex-col border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold flex items-center">
            <Settings className="mr-2" size={20} /> Settings
          </h2>
          <button onClick={toggleSettings} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Editor Appearance</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {availableThemes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-sm border ${
                    theme === t.id 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="flex items-center"><Palette size={14} className="mr-2" /> {t.name}</span>
                  {theme === t.id && <Check size={14} />}
                </button>
              ))}
            </div>
            <ToggleItem label="Minimap" icon={Map} value={showMinimap} onChange={toggleMinimap} />
            <ToggleItem label="Typewriter Mode" icon={AlignVerticalJustifyCenter} value={isTypewriterMode} onChange={toggleTypewriterMode} description="Keeps the cursor centered vertically" />
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Editor Behavior</h3>
            <ToggleItem label="Vim Mode" icon={Keyboard} value={isVimMode} onChange={toggleVimMode} description="Enable Vim keybindings" />
            <ToggleItem label="Sync Scroll" icon={Link2} value={isSyncScroll} onChange={toggleSyncScroll} description="Synchronize editor and preview scrolling" />
          </div>
        </div>
      </div>
    </div>
  );
};
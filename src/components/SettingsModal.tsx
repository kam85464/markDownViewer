import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { X, Settings, Check, Keyboard, Map, Link2, AlignVerticalJustifyCenter, Palette, Save, RotateCcw, HelpCircle, FileJson, Type, Download, Eye } from 'lucide-react';

// Load style presets from src/styles directory
const stylePresets = import.meta.glob('@/styles/*.css', { query: '?raw', import: 'default', eager: true });
const availableStyles = Object.entries(stylePresets).map(([path, content]) => ({
  name: path.split('/').pop() || 'Unknown',
  content: content as string
}));

const PreviewFrame = ({ css }: { css: string }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  ${css}
                  /* Ensure preview fits in iframe */
                  body { margin: 0; padding: 1rem; height: 100%; overflow: hidden; }
                </style>
              </head>
              <body class="markdown-body">
                <h1>Heading 1</h1>
                <h2>Heading 2</h2>
                <p>This is a <strong>preview</strong> of the selected style.</p>
                <ul>
                  <li>List item 1</li>
                  <li>List item 2</li>
                </ul>
                <code>console.log("Hello World");</code>
                <p><a href="#">Link example</a></p>
              </body>
            </html>
          `);
        doc.close();
      }
    }
  }, [css]);

  return (
    <iframe
      ref={iframeRef}
      title="Style Preview"
      className="w-full h-40 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-black"
    />
  );
};

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
    autoSaveEnabled,
    toggleAutoSave,
    plugins,
    customCSS,
    setCustomCSS
  } = useAppStore();

  const [previewStyle, setPreviewStyle] = useState<{ name: string, content: string } | null>(null);

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

  const handleSavePreset = () => {
    const blob = new Blob([customCSS], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `custom-style-${Date.now()}.css`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
            <ToggleItem label="Auto-Save" icon={Save} value={autoSaveEnabled} onChange={toggleAutoSave} description="Automatically save changes after 2 seconds of inactivity" />
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Editor Behavior</h3>
            <ToggleItem label="Vim Mode" icon={Keyboard} value={isVimMode} onChange={toggleVimMode} description="Enable Vim keybindings" />
            <ToggleItem label="Sync Scroll" icon={Link2} value={isSyncScroll} onChange={toggleSyncScroll} description="Synchronize editor and preview scrolling" />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Custom CSS</h3>
              {availableStyles.length > 0 && (
                <select
                  className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-300"
                  onChange={(e) => {
                    const style = availableStyles.find(s => s.name === e.target.value);
                    if (style) setPreviewStyle(style);
                    e.target.value = "";
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>Preview Preset...</option>
                  {availableStyles.map(s => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              )}
            </div>

            {previewStyle && (
              <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center">
                    <Eye size={12} className="mr-1" /> Preview: {previewStyle.name}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setPreviewStyle(null)}
                      className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        setCustomCSS(previewStyle.content);
                        setPreviewStyle(null);
                      }}
                      className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Apply
                    </button>
                  </div>
                </div>
                <PreviewFrame css={previewStyle.content} />
              </div>
            )}

            <textarea
              className="w-full h-32 p-3 text-xs font-mono bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-300 resize-none"
              placeholder="/* Add custom CSS for the preview pane here */"
              value={customCSS}
              onChange={(e) => setCustomCSS(e.target.value)}
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={handleSavePreset}
                className="flex items-center text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                title="Save current CSS as a file"
              >
                <Download size={12} className="mr-1" /> Save as Preset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
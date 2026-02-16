import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { X, Settings, Check, Keyboard, Map, Link2, AlignVerticalJustifyCenter, Palette, Save, RotateCcw, HelpCircle, FileJson, Type, Download, Eye, Package, CheckCircle, Circle, Target, Aperture, Clock, List, User, Shield, HardDrive, Search, Upload, Github, Cloud, Trash2, Info, Image, Lightbulb, Square, Circle as CircleIcon, AppWindow } from 'lucide-react';

// Load style presets from src/styles directory
const stylePresets = import.meta.glob('@/styles/*.css', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const availableStyles = Object.entries(stylePresets).map(([path, content]) => ({
  name: path.split('/').pop() || 'Unknown',
  content: content as string
}));

const PreviewFrame = ({ css }: { css: string }) => {
  const srcdoc = `<!DOCTYPE html>
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
    </html>`;

  return (
    <iframe
      title="Style Preview"
      srcDoc={srcdoc}
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
    enablePlugin,
    disablePlugin,
    customCSS,
    setCustomCSS,
    wordCountGoal,
    setWordCountGoal,
    isFocusMode,
    toggleFocusMode,
    fontSize,
    setFontSize,
    showRecentInSidebar,
    toggleShowRecentInSidebar,
    recentFilesLimit,
    setRecentFilesLimit,
    userId,
    openSettingsFile,
    githubToken,
    setGithubToken,
    settingsGistId,
    setSettingsGistId,
    backgroundAnimation,
    setBackgroundAnimation,
    backgroundAnimationColors,
    setBackgroundAnimationColors,
    showDailyQuote,
    toggleShowDailyQuote,
    edgeStyle,
    setEdgeStyle
  } = useAppStore();

  const [previewStyle, setPreviewStyle] = useState<{ name: string, content: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'editor' | 'account' | 'plugins' | 'advanced'>('general');
  const [allSettings, setAllSettings] = useState<Record<string, any>>({});
  const [settingsSearchQuery, setSettingsSearchQuery] = useState('');
  const [systemInfo, setSystemInfo] = useState<{ appVersion: string; electronVersion: string; nodeVersion: string; platform: string; arch: string } | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  useEffect(() => {
    if (showSettings && activeTab === 'advanced' && window.electron) {
      window.electron.getSettings().then(setAllSettings);
      window.electron.getSystemInfo().then(setSystemInfo);
    }
  }, [showSettings, activeTab]);

  const handleResetSettings = async () => {
    if (window.confirm('Are you sure you want to reset all settings to default? This action cannot be undone and will reload the application.')) {
      if (window.electron) {
        await window.electron.resetSettings();
        window.location.reload();
      }
    }
  };

  const handleFlushDatabase = async () => {
    if (window.confirm('DANGER: This will completely wipe the settings database file from disk and restart the application with factory defaults. All saved preferences will be lost. Are you sure?')) {
      if (window.electron) {
        await window.electron.resetSettings();
        window.location.reload();
      }
    }
  };

  const handleExportSettings = () => {
    const settingsStr = JSON.stringify(allSettings, null, 2);
    const blob = new Blob([settingsStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `markdown-viewer-settings.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const settings = JSON.parse(content);
        
        if (window.confirm('This will overwrite your current settings and reload the application. Continue?')) {
           if (window.electron) {
             for (const [key, value] of Object.entries(settings)) {
               await window.electron.setSetting(key, value);
             }
             window.location.reload();
           }
        }
      } catch (error) {
        alert('Failed to import settings: Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleUploadToGist = async () => {
    if (!githubToken) {
      alert('Please enter a GitHub Personal Access Token.');
      return;
    }

    // Exclude sensitive data from upload
    const settingsToUpload = { ...allSettings };
    delete settingsToUpload.githubToken;
    
    const settingsContent = JSON.stringify(settingsToUpload, null, 2);
    const filename = "markdown-viewer-settings.json";
    const description = "Settings for Markdown Viewer Pro";

    try {
      let url = 'https://api.github.com/gists';
      let method = 'POST';
      
      if (settingsGistId) {
        url += `/${settingsGistId}`;
        method = 'PATCH';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `token ${githubToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          files: {
            [filename]: {
              content: settingsContent
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.statusText}`);
      }

      const data = await response.json();
      if (!settingsGistId) {
        setSettingsGistId(data.id);
      }
      alert('Settings uploaded successfully to Gist!');
    } catch (error: any) {
      console.error(error);
      alert('Failed to upload settings: ' + error.message);
    }
  };

  const handleDownloadFromGist = async () => {
    if (!settingsGistId) {
      alert('Please enter a Gist ID.');
      return;
    }

    try {
      const headers: HeadersInit = {};
      if (githubToken) {
        headers['Authorization'] = `token ${githubToken}`;
      }

      const response = await fetch(`https://api.github.com/gists/${settingsGistId}`, { headers });

      if (!response.ok) throw new Error(`GitHub API Error: ${response.statusText}`);

      const data = await response.json();
      const filename = "markdown-viewer-settings.json";
      const file = data.files[filename];

      if (!file) throw new Error(`Gist does not contain ${filename}`);

      const settings = JSON.parse(file.content);
      
      if (window.confirm('This will overwrite your current settings and reload the application. Continue?')) {
          if (window.electron) {
            for (const [key, value] of Object.entries(settings)) {
              await window.electron.setSetting(key, value);
            }
            window.location.reload();
          }
      }
    } catch (error: any) {
      console.error(error);
      alert('Failed to download settings: ' + error.message);
    }
  };

  if (!showSettings) return null;

  if (isPreviewing) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-end justify-center pb-12 cursor-pointer"
        onClick={() => setIsPreviewing(false)}
      >
        <div className="bg-black/75 text-white px-6 py-3 rounded-full text-sm backdrop-blur-md shadow-lg animate-in fade-in slide-in-from-bottom-4 border border-white/10 pointer-events-none select-none">
          Click anywhere to exit preview
        </div>
      </div>
    );
  }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[600px] max-h-[80vh] flex flex-col border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold flex items-center">
            <Settings className="mr-2" size={20} /> Settings
          </h2>
          <button onClick={toggleSettings} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X size={20} />
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'general'
                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'editor'
                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'account'
                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Account
          </button>
          <button
            onClick={() => setActiveTab('plugins')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center ${
              activeTab === 'plugins'
                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Package size={16} className="mr-1" /> Plugins
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'advanced'
                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Advanced
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {/* General Settings Tab */}
          {activeTab === 'general' && (
            <>
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Appearance</h3>
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
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 mb-2">
                  <div className="flex items-center">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-md mr-3 text-gray-500 dark:text-gray-400">
                      <Image size={18} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">Background Animation</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Choose the home screen background</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPreviewing(true)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                      title="Preview Animation"
                    >
                      <Eye size={16} />
                    </button>
                    <select
                      value={backgroundAnimation}
                      onChange={(e) => setBackgroundAnimation(e.target.value)}
                      className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-300"
                    >
                      <option value="particles">Particles</option>
                      <option value="aurora">Aurora</option>
                      <option value="grid">Retro Grid</option>
                      <option value="random">Random</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 mb-2">
                  <div className="flex items-center">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-md mr-3 text-gray-500 dark:text-gray-400">
                      <AppWindow size={18} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">UI Edge Style</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Sharp, rounded, or curved corners</div>
                    </div>
                  </div>
                  <select
                    value={edgeStyle}
                    onChange={(e) => setEdgeStyle(e.target.value as any)}
                    className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-300"
                  >
                    <option value="sharp">Sharp</option>
                    <option value="rounded">Rounded</option>
                    <option value="curved">Curved</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 mb-2">
                  <div className="flex items-center">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-md mr-3 text-gray-500 dark:text-gray-400">
                      <Palette size={18} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">Animation Colors</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Customize background colors</div>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    {backgroundAnimationColors.map((color, index) => (
                      <div key={index} className="relative w-6 h-6 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 shadow-sm">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => {
                            const newColors = [...backgroundAnimationColors];
                            newColors[index] = e.target.value;
                            setBackgroundAnimationColors(newColors);
                          }}
                          className="absolute -top-2 -left-2 w-10 h-10 p-0 border-0 cursor-pointer"
                        />
                      </div>
                    ))}
                    <button 
                      onClick={() => setBackgroundAnimationColors(['#60a5fa', '#a78bfa', '#f472b6'])} 
                      className="ml-2 p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="Reset Colors"
                    >
                      <RotateCcw size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                 <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Application</h3>
                 <ToggleItem label="Daily Tip / Quote" icon={Lightbulb} value={showDailyQuote} onChange={toggleShowDailyQuote} description="Show a tip or quote on the home screen" />
                 <ToggleItem label="Auto-Save" icon={Save} value={autoSaveEnabled} onChange={toggleAutoSave} description="Automatically save changes after 2 seconds of inactivity" />
                 <ToggleItem label="Recent Files" icon={Clock} value={showRecentInSidebar} onChange={toggleShowRecentInSidebar} description="Show recently opened files in the sidebar" />
                 {showRecentInSidebar && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 mb-2 ml-8">
                    <div className="flex items-center">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-md mr-3 text-gray-500 dark:text-gray-400">
                        <List size={18} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">Recent Files Limit</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{recentFilesLimit} files</div>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={recentFilesLimit}
                      onChange={(e) => setRecentFilesLimit(parseInt(e.target.value))}
                      className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {/* Editor Settings Tab */}
          {activeTab === 'editor' && (
            <>
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Typography</h3>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 mb-2">
                  <div className="flex items-center">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-md mr-3 text-gray-500 dark:text-gray-400">
                      <Type size={18} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">Font Size</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{fontSize || 14}px</div>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="32"
                    value={fontSize || 14}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Behavior</h3>
                <ToggleItem label="Minimap" icon={Map} value={showMinimap} onChange={toggleMinimap} />
                <ToggleItem label="Typewriter Mode" icon={AlignVerticalJustifyCenter} value={isTypewriterMode} onChange={toggleTypewriterMode} description="Keeps the cursor centered vertically" />
                <ToggleItem label="Vim Mode" icon={Keyboard} value={isVimMode} onChange={toggleVimMode} description="Enable Vim keybindings" />
                <ToggleItem label="Sync Scroll" icon={Link2} value={isSyncScroll} onChange={toggleSyncScroll} description="Synchronize editor and preview scrolling" />
                <ToggleItem label="Focus Mode" icon={Aperture} value={isFocusMode} onChange={toggleFocusMode} description="Dims the UI when you start typing" />
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Writing Goals</h3>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 mb-2">
                    <div className="flex items-center">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-md mr-3 text-gray-500 dark:text-gray-400">
                        <Target size={18} /> 
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">Daily Word Count Goal</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Set a target number of words (0 to disable)</div>
                      </div>
                    </div>
                    <input 
                      type="number" 
                      min="0"
                      value={wordCountGoal} 
                      onChange={(e) => setWordCountGoal(parseInt(e.target.value) || 0)}
                      className="w-20 px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-300"
                    />
                </div>
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
            </>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                  <User size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Local User</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This device is registered locally.</p>
                
                <div className="w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="text-green-500" size={20} />
                    <div className="text-left">
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">User ID</div>
                      <div className="font-mono text-sm font-medium text-gray-900 dark:text-gray-200">{userId || 'Not Registered'}</div>
                    </div>
                  </div>
                  <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-medium">
                    Active
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-4 flex items-center gap-1"><HardDrive size={12}/> Settings are stored locally in SQLite.</p>
              </div>
            </div>
          )}

          {/* Plugins Tab */}
          {activeTab === 'plugins' && (
            <div className="space-y-3">
              {plugins.map(plugin => (
                <div key={plugin.id} className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {plugin.name} <span className="text-xs text-gray-500 ml-2">v{plugin.version}</span>
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{plugin.description}</p>
                    <p className="text-xs text-gray-400 mt-2">By {plugin.author}</p>
                  </div>
                  <button
                    onClick={() => plugin.enabled ? disablePlugin(plugin.id) : enablePlugin(plugin.id)}
                    className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors ml-4 flex-shrink-0 ${
                      plugin.enabled 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {plugin.enabled ? <><CheckCircle size={14} className="mr-1" /> Enabled</> : <><Circle size={14} className="mr-1" /> Disabled</>}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                  <Cloud size={14} className="mr-2" /> Settings Sync (GitHub Gist)
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub Personal Access Token</label>
                    <input 
                      type="password" 
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      placeholder="ghp_..."
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-200"
                    />
                    <p className="text-[10px] text-gray-500 mt-1">Required for uploading. Optional for downloading public Gists.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Gist ID</label>
                    <input 
                      type="text" 
                      value={settingsGistId}
                      onChange={(e) => setSettingsGistId(e.target.value)}
                      placeholder="e.g. 8f3..."
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-200"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={handleUploadToGist} className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors">
                      <Upload size={14} className="mr-2" />
                      Upload to Gist
                    </button>
                    <button onClick={handleDownloadFromGist} className="flex-1 flex items-center justify-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-xs font-medium rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Download size={14} className="mr-2" />
                      Download from Gist
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700">
                 <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                  <Info size={14} className="mr-2" /> System Information
                </h3>
                {systemInfo ? (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500 dark:text-gray-400">App Version:</div>
                    <div className="text-gray-900 dark:text-gray-100 font-mono">{systemInfo.appVersion}</div>
                    <div className="text-gray-500 dark:text-gray-400">Electron:</div>
                    <div className="text-gray-900 dark:text-gray-100 font-mono">{systemInfo.electronVersion}</div>
                    <div className="text-gray-500 dark:text-gray-400">Node:</div>
                    <div className="text-gray-900 dark:text-gray-100 font-mono">{systemInfo.nodeVersion}</div>
                    <div className="text-gray-500 dark:text-gray-400">Platform:</div>
                    <div className="text-gray-900 dark:text-gray-100 font-mono">{systemInfo.platform} ({systemInfo.arch})</div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Loading system info...</div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Raw Settings Data</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleResetSettings}
                      className="text-xs px-3 py-1.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded text-red-700 dark:text-red-400 transition-colors flex items-center"
                    >
                      <RotateCcw size={14} className="mr-2" />
                      Reset All
                    </button>
                    <button
                      onClick={handleFlushDatabase}
                      className="text-xs px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 rounded transition-colors flex items-center"
                      title="Completely wipe settings database"
                    >
                      <Trash2 size={14} className="mr-2" />
                      Flush DB
                    </button>
                    <button
                      onClick={handleExportSettings}
                      className="text-xs px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded text-blue-700 dark:text-blue-400 transition-colors flex items-center"
                    >
                      <Download size={14} className="mr-2" />
                      Export
                    </button>
                    <label className="text-xs px-3 py-1.5 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 rounded text-green-700 dark:text-green-400 transition-colors flex items-center cursor-pointer">
                      <Upload size={14} className="mr-2" />
                      Import
                      <input type="file" accept=".json" className="hidden" onChange={handleImportSettings} />
                    </label>
                    <button
                      onClick={openSettingsFile}
                      className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300 transition-colors flex items-center"
                    >
                      <FileJson size={14} className="mr-2" />
                      Open JSON File
                    </button>
                  </div>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Filter settings..."
                    value={settingsSearchQuery}
                    onChange={(e) => setSettingsSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-200"
                  />
                </div>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-medium">
                    <tr>
                      <th className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">Key</th>
                      <th className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                    {Object.entries(allSettings)
                      .filter(([key, value]) => 
                        key.toLowerCase().includes(settingsSearchQuery.toLowerCase()) || 
                        String(value).toLowerCase().includes(settingsSearchQuery.toLowerCase())
                      )
                      .map(([key, value]) => (
                        <tr key={key} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-4 py-2 font-mono text-xs text-blue-600 dark:text-blue-400">{key}</td>
                          <td className="px-4 py-2 font-mono text-xs text-gray-600 dark:text-gray-300 truncate max-w-[200px]" title={JSON.stringify(value)}>
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </td>
                        </tr>
                      ))}
                    {Object.keys(allSettings).length === 0 && (
                      <tr>
                        <td colSpan={2} className="px-4 py-8 text-center text-gray-500">
                          No settings found or running in browser mode.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
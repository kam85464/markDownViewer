import React, { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { EditorPane } from './EditorPane';
import { PreviewPane } from './PreviewPane';
import { Toolbar } from './Toolbar';
import { Tabs } from './Tabs';
import { StatusBar } from './StatusBar';
import { useAppStore } from '../store/useAppStore';
import { Presentation } from './Presentation';
import { ErrorBoundary } from './ErrorBoundary';
import { PluginsModal } from './PluginsModal';
import { TableOfContents } from './TableOfContents';
import { SettingsModal } from './SettingsModal';
import { Save } from 'lucide-react';

export const Layout: React.FC = () => {
  const { isEditing, isZenMode, isDistractionFreeMode, isPresentationMode, splitDirection, showTOC, autoSaveEnabled, saveCurrentFile, markdownContent, originalContent, currentFile } = useAppStore();

  useEffect(() => {
    if (!autoSaveEnabled || !currentFile || markdownContent === originalContent) return;

    const timer = setTimeout(() => {
      saveCurrentFile();
    }, 2000);

    return () => clearTimeout(timer);
  }, [autoSaveEnabled, currentFile, markdownContent, originalContent, saveCurrentFile]);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {isPresentationMode && <Presentation />}
      <PluginsModal />
      <SettingsModal />
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        {!isZenMode && !isDistractionFreeMode && <Sidebar />}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {!isDistractionFreeMode && <Tabs />}
          <div className={`flex-1 flex overflow-hidden relative ${splitDirection === 'horizontal' ? 'flex-col' : 'flex-row'}`}>
          {isEditing && (
            <div className={`${splitDirection === 'horizontal' ? 'h-1/2 w-full border-b' : 'w-1/2 h-full border-r'} border-gray-200 dark:border-gray-700`}>
              <ErrorBoundary name="Editor">
                <EditorPane />
              </ErrorBoundary>
            </div>
          )}
            <div className={`${isEditing ? (splitDirection === 'horizontal' ? 'h-1/2 w-full' : 'w-1/2 h-full') : 'w-full h-full'}`}>
              <ErrorBoundary name="Preview">
                <PreviewPane />
              </ErrorBoundary>
            </div>
          </div>
        </main>
        {!isZenMode && !isDistractionFreeMode && showTOC && <TableOfContents />}
      </div>
      {!isZenMode && !isDistractionFreeMode && <StatusBar />}
      {!isZenMode && !isDistractionFreeMode && autoSaveEnabled && (
        <div className="fixed bottom-1.5 right-4 z-50 flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 pointer-events-none select-none bg-white/80 dark:bg-gray-900/80 px-1 rounded">
          <Save size={10} />
          <span>Auto-Save</span>
        </div>
      )}
    </div>
  );
};
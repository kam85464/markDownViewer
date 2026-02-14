import React, { useEffect } from 'react';
import { Save } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Toolbar } from './Toolbar';
import { Tabs } from './Tabs';
import { StatusBar } from './StatusBar';
import { Presentation } from './Presentation';
import { ErrorBoundary } from './ErrorBoundary';
import { TableOfContents } from './TableOfContents';
import { useAppStore } from '../store/useAppStore';
import { EditorPane } from './EditorPane';
import { PreviewPane } from './PreviewPane';
import { SettingsModal } from './SettingsModal';


export const Layout: React.FC = () => { 
  const {
    isEditing,
    showTOC,
    autoSaveEnabled,
    saveCurrentFile,
    markdownContent,
    originalContent,
    currentFile,
    isDistractionFreeMode,
    splitDirection
  } = useAppStore();

  useEffect(() => {
    if (!autoSaveEnabled || !currentFile || markdownContent === originalContent) return;

    const timer = setTimeout(() => {
      saveCurrentFile();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* {isPresentationMode && <Presentation />} */}
      <SettingsModal />
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">

        {!isDistractionFreeMode && <Sidebar />}
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
     
      </div>
     
    </div>
  );
};
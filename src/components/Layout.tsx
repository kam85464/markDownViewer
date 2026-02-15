import React, { useEffect, useState } from 'react';
import { Save, X } from 'lucide-react';
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

  const [showDisclaimer, setShowDisclaimer] = useState(() => {
    return localStorage.getItem('disclaimer-dismissed') !== 'true';
  });

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
        <main id="app-main-content" className="flex-1 flex flex-col overflow-hidden relative"> 
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
      
      <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-3 py-0.5 text-[10px] text-gray-400 flex justify-between items-center">
        {showDisclaimer ? (
          <div className="flex items-center gap-2">
            <span>Disclaimer: This application is provided "as is" without warranty.</span>
            <button 
              onClick={() => { setShowDisclaimer(false); localStorage.setItem('disclaimer-dismissed', 'true'); }} 
              className="hover:text-gray-600 dark:hover:text-gray-200"
              title="Dismiss"
            >
              <X size={10} />
            </button>
          </div>
        ) : <div />}
        {!isDistractionFreeMode && <StatusBar />}
      </div>
    </div>
  );
};
import React from 'react';
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

export const Layout: React.FC = () => {
  const { isEditing, isZenMode, isDistractionFreeMode, isPresentationMode, splitDirection, showTOC } = useAppStore();

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
    </div>
  );
};
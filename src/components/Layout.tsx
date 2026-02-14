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

export const Layout: React.FC = () => {
  const { isEditing, isZenMode, isDistractionFreeMode, isPresentationMode } = useAppStore();

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {isPresentationMode && <Presentation />}
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        {!isZenMode && !isDistractionFreeMode && <Sidebar />}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {!isDistractionFreeMode && <Tabs />}
          <div className="flex-1 flex overflow-hidden relative">
          {isEditing && (
            <div className="w-1/2 h-full border-r border-gray-200 dark:border-gray-700">
              <ErrorBoundary name="Editor">
                <EditorPane />
              </ErrorBoundary>
            </div>
          )}
            <div className={`${isEditing ? 'w-1/2' : 'w-full'} h-full`}>
              <ErrorBoundary name="Preview">
                <PreviewPane />
              </ErrorBoundary>
            </div>
          </div>
        </main>
      </div>
      {!isZenMode && !isDistractionFreeMode && <StatusBar />}
    </div>
  );
};
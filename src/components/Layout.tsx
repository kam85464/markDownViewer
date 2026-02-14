import React from 'react';
import { Sidebar } from './Sidebar';
import { EditorPane } from './EditorPane';
import { PreviewPane } from './PreviewPane';
import { Toolbar } from './Toolbar';
import { StatusBar } from './StatusBar';
import { useAppStore } from '../store/useAppStore';

export const Layout: React.FC = () => {
  const { isEditing } = useAppStore();

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex overflow-hidden relative">
          {isEditing && (
            <div className="w-1/2 h-full border-r border-gray-200 dark:border-gray-700"><EditorPane /></div>
          )}
          <div className={`${isEditing ? 'w-1/2' : 'w-full'} h-full`}><PreviewPane /></div>
        </main>
      </div>
      <StatusBar />
    </div>
  );
};
import React from 'react';
import { useAppStore } from '../store/useAppStore';

export const StatusBar: React.FC = () => {
  const { currentFile, cursorPosition } = useAppStore();

  return (
    <div className="h-6 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center px-4 text-xs text-gray-600 dark:text-gray-400 select-none">
      <div className="flex-1 truncate">
        {currentFile ? currentFile.path : ''}
      </div>
      <div className="ml-4">
        Ln {cursorPosition.line}, Col {cursorPosition.column}
      </div>
    </div>
  );
};
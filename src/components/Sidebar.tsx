import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { FileText, FolderOpen } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { files, currentFile, selectFile, currentFolder } = useAppStore();

  // Group files by parent folder for better visualization
  const groupedFiles = files.reduce((acc, file) => {
    if (!acc[file.parent]) acc[file.parent] = [];
    acc[file.parent].push(file);
    return acc;
  }, {} as Record<string, typeof files>);

  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-full overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Explorer
        </h2>
        <p className="text-xs text-gray-400 truncate mt-1" title={currentFolder || ''}>
          {currentFolder ? currentFolder.split(/[/\\]/).pop() : 'No folder selected'}
        </p>
      </div>
      
      <div className="flex-1 p-2">
        {Object.entries(groupedFiles).map(([parent, groupFiles]) => (
          <div key={parent} className="mb-4">
            <div className="flex items-center px-2 py-1 text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
              <FolderOpen size={14} className="mr-2" /> {parent}
            </div>
            {groupFiles.map(file => (
              <button
                key={file.path}
                onClick={() => selectFile(file)}
                className={`w-full text-left flex items-center px-4 py-2 text-sm rounded-md mb-1 transition-colors ${
                  currentFile?.path === file.path 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <FileText size={14} className="mr-2" />
                <span className="truncate">{file.name}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { X, FileText } from 'lucide-react';

export const Tabs: React.FC = () => {
  const { openFiles, currentFile, selectFile, closeFile, closeOthers, closeToRight } = useAppStore();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; path: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  if (openFiles.length === 0) return null;

  const handleContextMenu = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, path });
  };

  return (
    <div className="flex bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-x-auto no-scrollbar h-9 relative">
      {openFiles.map(file => {
        const isActive = currentFile?.path === file.path;
        return (
          <div
            key={file.path}
            className={`
              group flex items-center min-w-[120px] max-w-[200px] px-3 text-xs border-r border-gray-200 dark:border-gray-700 cursor-pointer select-none transition-colors
              ${isActive 
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-t-2 border-t-blue-500' 
                : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 border-t-2 border-t-transparent'}
            `}
            onClick={() => selectFile(file)}
            onContextMenu={(e) => handleContextMenu(e, file.path)}
            title={file.path}
          >
            <FileText size={14} className={`mr-2 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
            <span className="truncate flex-1">{file.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeFile(file.path);
              }}
              className={`ml-2 p-0.5 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
      
      {contextMenu && (
        <div 
          ref={menuRef}
          className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 min-w-[160px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button 
            className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              closeOthers(contextMenu.path);
              setContextMenu(null);
            }}
          >
            Close Others
          </button>
          <button 
            className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              closeToRight(contextMenu.path);
              setContextMenu(null);
            }}
          >
            Close to the Right
          </button>
        </div>
      )}
    </div>
  );
};
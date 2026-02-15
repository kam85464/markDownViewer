import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { X, FileText } from 'lucide-react';

export const Tabs: React.FC = () => {
  const { openFiles, currentFile, selectFile, closeFile, setOpenFiles, markdownContent, originalContent, closeToRight, duplicateTab, reopenClosedTab, closedFiles } = useAppStore();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; file: any } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [draggedIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleContextMenu = (e: React.MouseEvent, file: any) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, file });
  };

  const handleCloseOthers = () => {
    if (contextMenu && openFiles) {
      const newOpenFiles = openFiles.filter((f: any) => f.path === contextMenu.file.path);
      setOpenFiles(newOpenFiles);
      if (currentFile?.path !== contextMenu.file.path) {
        selectFile(contextMenu.file);
      }
      setContextMenu(null);
    }
  };

  const handleCloseAll = () => {
    setOpenFiles([]);
    selectFile(null);
    setContextMenu(null);
  };

  const handleCloseSaved = () => {
    const isDirty = currentFile && markdownContent !== originalContent;
    if (isDirty && currentFile) {
      setOpenFiles([currentFile]);
    } else {
      setOpenFiles([]);
      selectFile(null);
    }
    setContextMenu(null);
  };

  const handleCloseToRight = async () => {
    if (contextMenu) {
      await closeToRight(contextMenu.file.path);
      setContextMenu(null);
    }
  };

  const handleDuplicate = async () => {
    if (contextMenu) {
      await duplicateTab(contextMenu.file);
      setContextMenu(null);
    }
  };

  const handleReopenClosed = async () => {
    if (closedFiles.length > 0) {
      await reopenClosedTab();
      setContextMenu(null);
    }
  };

  const onDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const newOpenFiles = [...openFiles];
    const draggedItem = newOpenFiles[draggedIndex];
    newOpenFiles.splice(draggedIndex, 1);
    newOpenFiles.splice(index, 0, draggedItem);
    setOpenFiles(newOpenFiles);
    setDragIndex(index);
  };

  const onDragEnd = () => {
    setDragIndex(null);
  };

  if (!openFiles || openFiles.length === 0) return null;

  return (
    <div className="flex bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-x-auto no-scrollbar">
      {openFiles.map((file: any, index: number) => (
        <div
          key={file.path}
          draggable
          onDragStart={(e) => onDragStart(e, index)}
          onDragOver={(e) => { e.preventDefault(); onDragOver(index); }}
          onDragEnd={onDragEnd}
          onContextMenu={(e) => handleContextMenu(e, file)}
          className={`
            group flex items-center min-w-[120px] max-w-[200px] h-9 px-3 text-xs border-r border-gray-200 dark:border-gray-700 cursor-pointer select-none transition-colors duration-200
            animate-in fade-in slide-in-from-left-2 duration-200
            ${currentFile?.path === file.path 
              ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-t-2 border-t-blue-600 dark:border-t-blue-400' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}
            ${draggedIndex === index ? 'opacity-50' : ''}
          `}
          onClick={() => selectFile(file)}
          title={file.path}
        >
          <FileText size={14} className="mr-2 flex-shrink-0 opacity-70" />
          <span className="truncate flex-1">{file.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeFile(file.path);
            }}
            className={`ml-2 p-0.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-gray-300 dark:hover:bg-gray-600 ${currentFile?.path === file.path ? 'opacity-100' : ''}`}
          >
            <X size={12} />
          </button>
        </div>
      ))}

      {contextMenu && (
        <div
          ref={menuRef}
          className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 min-w-[160px] animate-in fade-in zoom-in-95 duration-100"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            onClick={handleCloseOthers}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Close Others
          </button>
          <button
            onClick={handleCloseToRight}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Close to the Right
          </button>
          <button
            onClick={handleDuplicate}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Duplicate
          </button>
          <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
          <button
            onClick={handleReopenClosed}
            disabled={closedFiles.length === 0}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reopen Closed Tab
          </button>
          <button
            onClick={handleCloseSaved}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Close Saved
          </button>
          <button
            onClick={handleCloseAll}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Close All
          </button>
        </div>
      )}
    </div>
  );
};

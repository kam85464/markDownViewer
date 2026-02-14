import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { fileService } from '../services/fileService';
import md from '../services/markdownService';
import { FolderOpen, Save, Moon, Sun, Columns, Eye, FolderX, ChevronDown, FileDown, FilePlus, Search, Maximize, Minimize, Projector, Scan, FileCode, Package, Rows, Columns as ColumnsIcon, Settings, WrapText, Sparkles } from 'lucide-react';

export const Toolbar: React.FC = () => {
  const { 
    setFolder, 
    setFiles, 
    saveCurrentFile, 
    isEditing, 
    toggleEditMode, 
    isDarkMode, 
    toggleDarkMode,
    currentFile,
    closeFolder,
    currentFolder,
    recentFolders,
    loadRecentFolders,
    markdownContent,
    originalContent,
    saveAs,
    triggerFind,
    isZenMode,
    toggleZenMode,
    togglePresentationMode,
    isDistractionFreeMode,
    toggleDistractionFreeMode,
    togglePluginsModal,
    splitDirection,
    toggleSplitDirection,
    toggleSettings,
    wordWrap,
    toggleWordWrap,
    formatCurrentFile
  } = useAppStore();

  const [showRecent, setShowRecent] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadRecentFolders();
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowRecent(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenFolder = async () => {
    const path = await fileService.selectFolder();
    if (path) {
      setFolder(path);
      const files = await fileService.scanFolder(path);
      setFiles(files);
      loadRecentFolders();
    }
  };

  const handleRecentClick = async (path: string) => {
    setFolder(path);
    const files = await fileService.scanFolder(path);
    setFiles(files);
    setShowRecent(false);
  };

  const handleCloseFolder = async () => {
    if (currentFile && markdownContent !== originalContent) {
      const response = await fileService.showConfirmDialog({
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Unsaved Changes',
        message: 'You have unsaved changes. Are you sure you want to close the folder?',
        detail: 'Your changes will be lost if you do not save them.'
      });
      
      if (response === 1) return; // User clicked 'No'
    }
    closeFolder();
  };

  const handleExportPdf = async () => {
    if (!markdownContent) return;
    const html = md.render(markdownContent);
    await fileService.exportToPdf(html);
  };

  const handleExportHtml = async () => {
    if (!markdownContent) return;
    const html = md.render(markdownContent);
    await fileService.exportToHtml(html);
  };

  return (
    <div className="h-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 draggable">
      <div className="flex items-center space-x-2 no-drag">
        <div className="relative flex items-center" ref={dropdownRef}>
          <button onClick={handleOpenFolder} className="btn-toolbar rounded-r-none border-r border-gray-300 dark:border-gray-600" title="Open Folder">
            <FolderOpen size={18} />
          </button>
          <button 
            onClick={() => setShowRecent(!showRecent)} 
            className="btn-toolbar rounded-l-none px-1" 
            title="Recent Folders"
          >
            <ChevronDown size={14} />
          </button>

          {showRecent && recentFolders.length > 0 && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 py-1">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 mb-1">
                Recent Folders
              </div>
              {recentFolders.map((folder, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentClick(folder)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 truncate"
                  title={folder}
                >
                  {folder}
                </button>
              ))}
            </div>
          )}
        </div>

        {currentFolder && (
          <button onClick={handleCloseFolder} className="btn-toolbar" title="Close Folder">
            <FolderX size={18} />
          </button>
        )}
        <button onClick={handleExportPdf} disabled={!markdownContent} className="btn-toolbar disabled:opacity-50" title="Export to PDF">
          <FileDown size={18} />
        </button>
        <button onClick={handleExportHtml} disabled={!markdownContent} className="btn-toolbar disabled:opacity-50" title="Export to HTML">
          <FileCode size={18} />
        </button>
        <button onClick={saveAs} disabled={!markdownContent} className="btn-toolbar disabled:opacity-50" title="Save As">
          <FilePlus size={18} />
        </button>
        <button onClick={saveCurrentFile} disabled={!currentFile} className="btn-toolbar disabled:opacity-50" title="Save">
          <Save size={18} />
        </button>
      </div>

      <div className="flex items-center space-x-2 no-drag">
        <button onClick={togglePluginsModal} className="btn-toolbar" title="Plugins">
          <Package size={18} />
        </button>
        {isEditing && (
          <button onClick={toggleSplitDirection} className="btn-toolbar" title={splitDirection === 'vertical' ? "Split Horizontally" : "Split Vertically"}>
            {splitDirection === 'vertical' ? <Rows size={18} /> : <ColumnsIcon size={18} />}
          </button>
        )}
        {isEditing && (
          <button onClick={triggerFind} className="btn-toolbar" title="Find & Replace">
            <Search size={18} />
          </button>
        )}
        {isEditing && (
          <button onClick={formatCurrentFile} className="btn-toolbar" title="Format Document">
            <Sparkles size={18} />
          </button>
        )}
        <button onClick={toggleWordWrap} className={`btn-toolbar ${wordWrap ? 'text-blue-600 dark:text-blue-400' : ''}`} title="Toggle Word Wrap">
          <WrapText size={18} />
        </button>
        <button onClick={togglePresentationMode} className="btn-toolbar" title="Presentation Mode">
          <Projector size={18} />
        </button>
        <button onClick={toggleDistractionFreeMode} className={`btn-toolbar ${isDistractionFreeMode ? 'text-blue-600 dark:text-blue-400' : ''}`} title={isDistractionFreeMode ? "Exit Distraction Free Mode" : "Distraction Free Mode (Hides All Chrome)"}>
          <Scan size={18} />
        </button>
        <button onClick={toggleZenMode} className="btn-toolbar" title={isZenMode ? "Exit Zen Mode" : "Enter Zen Mode (Hides Sidebar)"}>
          {isZenMode ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>
        <button onClick={toggleEditMode} className="btn-toolbar" title={isEditing ? "Switch to Preview" : "Switch to Edit"}>
          {isEditing ? <Eye size={18} /> : <Columns size={18} />}
          <span className="ml-2 text-sm">{isEditing ? 'Preview Mode' : 'Edit Mode'}</span>
        </button>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

        <button onClick={toggleDarkMode} className="btn-toolbar">
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        
        <button onClick={toggleSettings} className="btn-toolbar" title="Settings">
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
};
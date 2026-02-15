import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { fileService } from '../services/fileService';
import md from '../services/markdownService';
import { githubService } from '../services/githubService';
import { FolderOpen, Save, Moon, Sun, Columns, Eye, FolderX, ChevronDown, FileDown, FilePlus, Search, Maximize, Minimize, Projector, Scan, FileCode, Rows, Columns as ColumnsIcon, Settings, WrapText, Sparkles, ScanEye, Scale3DIcon, NotebookPenIcon, BookAIcon, Github, Loader } from 'lucide-react';

// Helper component for toolbar buttons with conditional labels
const ToolbarButton: React.FC<{
  icon: React.ReactNode;
  label?: string;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  showLabel?: boolean;
  highlight?: boolean;
  className?: string;
}> = ({ icon, label, onClick, disabled, title, showLabel, highlight, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`
      flex items-center gap-1 px-3 py-2 rounded text-sm font-medium transition-colors
      ${highlight ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}
      hover:bg-gray-100 dark:hover:bg-gray-700
      disabled:opacity-50 disabled:cursor-not-allowed
      ${className}
    `}
  >
    <span className="flex items-center">{icon}</span>
    {showLabel && label && <span>{label}</span>}
  </button>
);



export const Toolbar: React.FC = () => {
  const { 
    setFolder, 
    setFiles, 
    saveCurrentFile, 
    isEditing, 
    toggleEditMode,
    isDarkMode,
    saveAs,

    triggerFind,
    isDistractionFreeMode,
    toggleDistractionFreeMode,
    toggleSplitDirection,
    toggleSettings,
    wordWrap,

    markdownContent,
    originalContent,
    recentFolders,
    loadRecentFolders,
    closeFolder,
    toggleDarkMode,
    currentFolder,
    currentFile,
    splitDirection,
    formatCurrentFile,
    setMarkdownContent
  } = useAppStore();

  const [showRecent, setShowRecent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    try {
      setFolder(path);
      const files = await fileService.scanFolder(path);
      setFiles(files);
      setShowRecent(false);
    } catch (error) {
      console.error('Failed to open recent folder:', error);
    }
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

  const handleLoadFromGithub = async () => {
    const url = window.prompt("Enter GitHub repository URL:");
    if (url) {
      setIsLoading(true);
      try {
        const result = await githubService.loadFromUrl(url);
        if (result.type === 'file' && result.content) {
          setMarkdownContent(result.content);
        } else if (result.type === 'dir' && result.files) {
          setFiles(result.files as any);
          setFolder(url);
        }
      } catch (error) {
        console.error("GitHub load error:", error);
        alert("Failed to load from GitHub. Check console for details.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="h-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 draggable">
      <div className="flex items-center space-x-1 no-drag">
        <div className="relative flex items-center" ref={dropdownRef}>
          <button onClick={handleOpenFolder} className="btn-toolbar rounded-r-none border-r border-gray-300 dark:border-gray-600"title="Open Folder">
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
        <ToolbarButton icon={isLoading ? <Loader size={18} className="animate-spin" /> : <Github size={18} />} onClick={handleLoadFromGithub} title="Load from GitHub" disabled={isLoading} />

        {currentFolder && (
          <button onClick={handleCloseFolder} className="btn-toolbar" title="Close Folder">
            <FolderX size={18} />
          </button>
        )}
        <ToolbarButton icon={<FileDown size={18} />} label="PDF" onClick={handleExportPdf} disabled={!markdownContent} showLabel={isEditing} title="Export to PDF" />
        <ToolbarButton icon={<FileCode size={18} />} label="HTML" onClick={handleExportHtml} disabled={!markdownContent} showLabel={isEditing} title="Export to HTML" />
        <ToolbarButton icon={<FilePlus size={18} />} label="Save As" onClick={saveAs} disabled={!markdownContent} showLabel={isEditing} title="Save As" />
        <ToolbarButton icon={<Save size={18} />} label="Save" onClick={saveCurrentFile} disabled={!currentFile} showLabel={isEditing} title="Save" />
      </div>

      <div className="flex items-center space-x-1 no-drag">
        {isEditing && (
          <ToolbarButton icon={splitDirection === 'vertical' ? <Rows size={18} /> : <ColumnsIcon size={18} />} label={splitDirection === 'vertical' ? "Split H" : "Split V"} onClick={toggleSplitDirection} showLabel={isEditing} title={splitDirection === 'vertical' ? "Split Horizontally" : "Split Vertically"} />
        )}
        {isEditing && (
          <ToolbarButton icon={<Search size={18} />} label="Find" onClick={triggerFind} showLabel={isEditing} title="Find & Replace" />
        )}
        {isEditing && (
          <ToolbarButton icon={<Sparkles size={18} />} label="Format" onClick={formatCurrentFile} showLabel={isEditing} title="Format Document" />
        )}
        <ToolbarButton icon={<Scan size={18} />} label="Zen Mode" onClick={toggleDistractionFreeMode} showLabel={isEditing} title="Zen Mode"  />
          {isEditing ? <Eye size={18} /> : <Columns size={18} />}
        <ToolbarButton icon={<Scan size={18} />} label="Distraction Free" onClick={toggleDistractionFreeMode} showLabel={isEditing} title="Distraction Free Mode"  />
        
        <button onClick={toggleEditMode} className="btn-toolbar"  title={isEditing ? "Switch to Preview" : "Switch to Edit"}>
        <span className="ml-2 text-sm">{isEditing ? 'Preview'  : 'Edit'}</span>&nbsp;
          {isEditing ? <BookAIcon size={18} /> : <NotebookPenIcon size={18} />}
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
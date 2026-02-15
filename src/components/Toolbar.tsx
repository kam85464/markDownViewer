import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { fileService } from '../services/fileService';
import md from '../services/markdownService';
import { githubService } from '../services/githubService';
import { FolderOpen, Save, Moon, Sun, Columns, Eye, FolderX, ChevronDown, FileDown, FilePlus, Search, Maximize, Minimize, Projector, Scan, FileCode, Rows, Columns as ColumnsIcon, Settings, WrapText, Sparkles, ScanEye, Scale3DIcon, NotebookPenIcon, BookAIcon, Github, Loader, HelpCircle, Aperture } from 'lucide-react';

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
  id?: string;
}> = ({ icon, label, onClick, disabled, title, showLabel, highlight, className = '', id }) => (
  <button
    onClick={onClick}
    id={id}
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

const FeatureListModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-in fade-in duration-200">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto animate-in zoom-in-95 duration-200">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Features & User Manual</h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 text-sm">
        <li><strong>File Explorer:</strong> Open local folders or load GitHub repositories directly via URL.</li>
        <li><strong>Git Integration:</strong> View status, commit, push, pull, create branches, and manage PRs directly from the sidebar.</li>
        <li><strong>Live Preview:</strong> See your markdown rendered in real-time with support for diagrams and math.</li>
        <li><strong>Export:</strong> Export your documents to HTML or PDF.</li>
        <li><strong>Editor Modes:</strong> Switch between Vim and standard editing, or use Distraction Free (Zen) mode.</li>
        <li><strong>Search:</strong> Filter files in the explorer or search text within the editor.</li>
        <li><strong>Tour:</strong> Take a guided tour of the application features via the Help menu.</li>
        <li><strong>Shortcuts:</strong> Press <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-xs font-mono">F1</kbd> to toggle this help menu.</li>
      </ul>
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">Disclaimer</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          This application is provided "as is", without warranty of any kind, express or implied. The authors or copyright holders shall not be liable for any claim, damages or other liability.
        </p>
      </div>
      <div className="mt-6 flex justify-end">
        <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Close</button>
      </div>
    </div>
  </div>
);

const TourOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const steps = [
    { title: "Welcome", content: "Welcome to Markdown Viewer Pro! This tool allows you to edit and preview Markdown files with ease.", targetId: null },
    { title: "Sidebar", content: "The sidebar on the left shows your files. If you open a Git repository, it also shows Git status and Pull Requests.", targetId: "app-sidebar" },
    { title: "Toolbar", content: "Use the toolbar to Open folders, Save files, Export, and toggle settings like Dark Mode or Vim Mode.", targetId: "app-toolbar" },
    { title: "Editor & Preview", content: "The main area is split between the Editor and the Preview. You can adjust the split or toggle visibility.", targetId: "app-main-content" },
    { title: "GitHub", content: "You can load files directly from GitHub using the GitHub icon in the toolbar.", targetId: "toolbar-github-btn" }
  ];
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const targetId = steps[step].targetId;
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        setRect(el.getBoundingClientRect());
      } else {
        setRect(null);
      }
    } else {
      setRect(null);
    }
  }, [step]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-in fade-in duration-200">
       {rect ? (
         <div 
           className="fixed z-40 transition-all duration-300 ease-in-out border-2 border-blue-500 rounded shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] pointer-events-none"
           style={{
             top: rect.top,
             left: rect.left,
             width: rect.width,
             height: rect.height,
           }}
         />
       ) : null}

       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full z-50 relative animate-in zoom-in-95 duration-200">
         <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{steps[step].title} ({step + 1}/{steps.length})</h3>
         <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm">{steps[step].content}</p>
         <div className="flex justify-between">
           <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm">Skip</button>
           <div className="space-x-2">
             <button 
               onClick={() => setStep(s => Math.max(0, s - 1))} 
               disabled={step === 0}
               className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 text-sm dark:text-gray-300"
             >
               Previous
             </button>
             <button 
               onClick={() => {
                   if (step < steps.length - 1) setStep(s => s + 1);
                   else onClose();
               }} 
               className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
             >
               {step === steps.length - 1 ? "Finish" : "Next"}
             </button>
           </div>
         </div>
       </div>
    </div>
  );
};

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
    isFocusMode,
    toggleFocusMode,
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
  const [showHelp, setShowHelp] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const helpMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadRecentFolders();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowRecent(false);
      }
      if (helpMenuRef.current && !helpMenuRef.current.contains(event.target as Node)) {
        setShowHelp(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        setShowHelp(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
    <div id="app-toolbar" className="h-12 bg-[#fcfcfc] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 draggable">
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
        <ToolbarButton id="toolbar-github-btn" icon={isLoading ? <Loader size={18} className="animate-spin" /> : <Github size={18} />} onClick={handleLoadFromGithub} title="Load from GitHub" disabled={isLoading} />

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
        <ToolbarButton icon={<Aperture size={18} />} label="Focus" onClick={toggleFocusMode} showLabel={isEditing} title="Focus Mode (Dims UI when typing)" highlight={isFocusMode} />
        <ToolbarButton icon={<Scan size={18} />} label="Zen Mode" onClick={toggleDistractionFreeMode} showLabel={isEditing} title="Zen Mode"  />
          {isEditing ? <Eye size={18} /> : <Columns size={18} />}
        <ToolbarButton icon={<Scan size={18} />} label="Distraction Free" onClick={toggleDistractionFreeMode} showLabel={isEditing} title="Distraction Free Mode"  />
        
        <button onClick={toggleEditMode} className="btn-toolbar disabled:opacity-50 disabled:cursor-not-allowed" disabled={!currentFile} title={isEditing ? "Switch to Preview" : "Switch to Edit"}>
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

        <div className="relative" ref={helpMenuRef}>
          <button onClick={() => setShowHelp(!showHelp)} className="btn-toolbar" title="Help">
            <HelpCircle size={18} />
          </button>
          {showHelp && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 py-1">
              <button 
                onClick={() => { setShowFeatures(true); setShowHelp(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Features List / Manual
              </button>
              <button 
                onClick={() => { setShowTour(true); setShowHelp(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Start Tour
              </button>
            </div>
          )}
        </div>
      </div>
      {showFeatures && <FeatureListModal onClose={() => setShowFeatures(false)} />}
      {showTour && <TourOverlay onClose={() => setShowTour(false)} />}
    </div>
  );
};
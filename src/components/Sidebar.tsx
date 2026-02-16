import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { FileText, FolderOpen, Search, Loader, ChevronRight, ChevronDown, GitBranch, GitPullRequest, GitCommit, GitMerge, RefreshCw, Upload, Check, Plus, Key, Circle, ListCollapse, Replace, Edit, Clock, Trash2, FolderPlus } from 'lucide-react';
import { githubService } from '../services/githubService';
import { fileService } from '../services/fileService';

interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'dir';
  children: Record<string, TreeNode>;
  file?: any;
}

const FileTreeItem: React.FC<{
  node: TreeNode;
  depth: number;
  onSelect: (file: any) => void;
  onContextMenu: (e: React.MouseEvent, file: any) => void;
  currentFile: any;
  loadingFile: string | null;
  isDirty: boolean;
  defaultOpen?: boolean;
}> = ({ node, depth, onSelect, onContextMenu, currentFile, loadingFile, isDirty, defaultOpen }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen || false);
  const isSelected = currentFile?.path === node.file?.path;
  const isModified = node.type === 'file' && isSelected && isDirty;

  if (node.type === 'file') {
    return (
      <button
        onClick={() => onSelect(node.file)}
        onContextMenu={(e) => onContextMenu(e, node.file)}
        className={`w-full text-left flex items-center py-1 px-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
          isSelected ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100' : 'text-gray-700 dark:text-gray-300'
        }`}
        style={{ paddingLeft: `${depth * 12 + 12}px` }}
      >
        {loadingFile === node.file?.path ? (
          <Loader size={14} className="mr-2 animate-spin" />
        ) : (
          <FileText size={14} className="mr-2 flex-shrink-0" />
        )}
        <span className="truncate">{node.name}</span>
        {isModified && <div className="w-2 h-2 rounded-full bg-yellow-500 ml-auto flex-shrink-0" title="Unsaved changes" />}
      </button>
    );
  }

  useEffect(() => {
    if (defaultOpen) setIsOpen(true);
  }, [defaultOpen]);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onContextMenu={(e) => onContextMenu(e, { ...node, type: 'dir' })}
        className="w-full text-left flex items-center py-1 px-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
        style={{ paddingLeft: `${depth * 12}px` }}
      >
        <ChevronRight size={14} className={`mr-1 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
        <FolderOpen size={14} className="mr-2 flex-shrink-0" />
        <span className="truncate">{node.name}</span>
      </button>
      {isOpen && (
        <div className="animate-in slide-in-from-top-1 fade-in duration-200">
          {Object.values(node.children)
            .sort((a, b) => {
              if (a.type === b.type) return a.name.localeCompare(b.name);
              return a.type === 'dir' ? -1 : 1;
            })
            .map((child) => (
              <FileTreeItem
                key={child.path}
                node={child}
                depth={depth + 1}
                onSelect={onSelect}
                onContextMenu={onContextMenu}
                currentFile={currentFile}
                loadingFile={loadingFile}
                isDirty={isDirty}
                defaultOpen={defaultOpen}
              />
            ))}
        </div>
      )}
    </div>
  );
};

const FileTreeSkeleton = () => (
  <div className="p-2 space-y-2">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="flex items-center gap-2 px-2 py-1 animate-pulse">
        <div className="w-4 h-4 bg-gray-200 dark:bg-gray-800 rounded flex-shrink-0" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded" style={{ width: `${Math.random() * 50 + 30}%` }} />
      </div>
    ))}
  </div>
);

export const Sidebar: React.FC = () => {
  const { files, currentFile, selectFile, currentFolder, setMarkdownContent, markdownContent, originalContent, setFiles, showRecentInSidebar, recentFilesLimit } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [isReplacing, setIsReplacing] = useState(false);
  const [loadingFile, setLoadingFile] = useState<string | null>(null);
  const [gitLoading, setGitLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'files' | 'prs' | 'search'>('files');
  const [pullRequests, setPullRequests] = useState<any[]>([]);
  const isDirty = !!currentFile && markdownContent !== originalContent;
  const [treeKey, setTreeKey] = useState(0);
  const [defaultOpen, setDefaultOpen] = useState(true);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; file: any } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [recentFiles, setRecentFiles] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('recentFiles') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    setDefaultOpen(true);
  }, [currentFolder]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filteredFiles = files ? files.filter(file =>
    file.path.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const globalSearchResults = useMemo(() => {
    if (!globalSearchQuery || !files) return [];
    return files.filter(file => file.path.toLowerCase().includes(globalSearchQuery.toLowerCase()));
  }, [files, globalSearchQuery]);

  const fileTree = useMemo(() => {
    const root: Record<string, TreeNode> = {};
    
    filteredFiles.forEach(file => {
      // Normalize path: remove leading slash if present
      const normalizedPath = file.path.startsWith('/') ? file.path.slice(1) : file.path;
      // If we are in local mode, we might want to strip the root folder path to make it relative
      // But for simplicity, let's assume file.path is what we want to display or relative to currentFolder
      
      // For GitHub files, path is relative (e.g. "src/foo.md")
      const parts = normalizedPath.split('/');
      
      let currentLevel = root;
      
      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1;
        const path = parts.slice(0, index + 1).join('/');
        
        if (!currentLevel[part]) {
          currentLevel[part] = {
            name: part,
            path: path,
            type: isFile ? 'file' : 'dir',
            children: {},
            file: isFile ? file : undefined
          };
        }
        
        if (!isFile) {
          currentLevel = currentLevel[part].children;
        }
      });
    });

    return root;
  }, [filteredFiles]);

  const handleFileClick = async (file: any) => {
    selectFile(file);
    
    const newRecent = [file, ...recentFiles.filter(f => f.path !== file.path)].slice(0, recentFilesLimit || 10);
    setRecentFiles(newRecent);
    localStorage.setItem('recentFiles', JSON.stringify(newRecent));

    if (file.download_url) {
      setLoadingFile(file.path);
      try {
        const response = await fetch(file.download_url);
        if (response.ok) {
          const content = await response.text();
          setMarkdownContent(content);
        }
      } catch (error) {
        console.error("Error loading file:", error);
      } finally {
        setLoadingFile(null);
      }
    }
  };

  const isGithub = currentFolder?.startsWith('https://github.com');
  
  const handleGitAction = async (action: string) => {
    if (action === 'fetch-prs') {
        if (!isGithub) return;
        const urlObj = new URL(currentFolder!);
        const parts = urlObj.pathname.split('/').filter(Boolean);
        const owner = parts[0];
        const repo = parts[1];
        setGitLoading(true);
        try {
            const prs = await githubService.getPullRequests(owner, repo);
            setPullRequests(prs);
        } catch (e) {
            console.error(e);
        } finally {
            setGitLoading(false);
        }
        return;
    }
    if (!isGithub) return;
    const urlObj = new URL(currentFolder!);
    const parts = urlObj.pathname.split('/').filter(Boolean);
    const owner = parts[0];
    const repo = parts[1];
    const branch = parts[3] || 'main'; // Approximation

    setGitLoading(true);
    try {
      switch (action) {
        case 'token':
          const token = prompt('Enter GitHub Personal Access Token:');
          if (token) githubService.setToken(token);
          break;
        case 'fetch':
          // Re-fetch tree
          const result = await githubService.loadFromUrl(currentFolder!);
          if (result.files) {
             // This would need a store action to update files, assuming setFiles is available
             // setFiles(result.files); 
             alert('Fetched successfully');
          }
          break;
        case 'commit':
          if (!currentFile) return alert('No file selected');
          const msg = prompt('Commit message:');
          if (msg) {
            await githubService.commitFile(owner, repo, branch, currentFile.path, markdownContent, msg);
            alert('Committed successfully');
          }
          break;
        case 'branch':
          const newBranch = prompt('New branch name:');
          if (newBranch) {
            await githubService.createBranch(owner, repo, branch, newBranch);
            alert(`Branch ${newBranch} created`);
          }
          break;
        case 'pr':
          const prTitle = prompt('PR Title:');
          const prHead = prompt('Head branch:', branch);
          const prBase = prompt('Base branch:', 'main');
          if (prTitle && prHead && prBase) {
            await githubService.createPullRequest(owner, repo, prHead, prBase, prTitle, 'Created from Markdown Viewer');
            alert('PR Created');
          }
          break;
        case 'merge':
          const prNum = prompt('PR Number to squash merge:');
          if (prNum) {
            await githubService.mergePullRequest(owner, repo, parseInt(prNum), 'squash');
            alert('Merged successfully');
          }
          break;
      }
    } catch (e: any) {
      alert('Git action failed: ' + e.message);
    } finally {
      setGitLoading(false);
    }
  };

  const handleCollapseAll = () => {
    setDefaultOpen(false);
    setTreeKey(prev => prev + 1);
  };

  const handleReplaceAll = async () => {
    if (!globalSearchQuery || !replaceQuery || !files) return;
    if (isGithub) {
      alert("Bulk replace is not currently supported for GitHub repositories.");
      return;
    }
    
    if (!window.confirm(`Replace "${globalSearchQuery}" with "${replaceQuery}" in all files?`)) return;

    setIsReplacing(true);
    let count = 0;
    try {
      for (const file of files) {
        if (file.isDirectory) continue;
        try {
          const content = await fileService.readFile(file.path);
          if (content.includes(globalSearchQuery)) {
            const newContent = content.replaceAll(globalSearchQuery, replaceQuery);
            await fileService.saveFile(file.path, newContent);
            count++;
          }
        } catch (e) {
          console.error(`Failed to replace in ${file.path}`, e);
        }
      }
      alert(`Replaced occurrences in ${count} files.`);
    } finally {
      setIsReplacing(false);
    }
  };

  const handleNewFolder = async () => {
    if (!contextMenu) return;
    const { file } = contextMenu;
    
    if (isGithub) {
      alert("Creating folders in GitHub repositories is not supported yet.");
      setContextMenu(null);
      return;
    }

    const folderName = prompt("Enter folder name:");
    if (!folderName) {
        setContextMenu(null);
        return;
    }

    let parentPath = file.path;
    // Determine if we are right-clicking a directory or a file
    // Directory nodes have type: 'dir'
    // File objects might have isDirectory: false or type: 'file'
    const isDirectory = file.type === 'dir' || file.isDirectory === true;

    if (!isDirectory) {
        const parts = file.path.split('/');
        parts.pop();
        parentPath = parts.join('/');
    }
    
    const newPath = parentPath ? `${parentPath}/${folderName}` : folderName;

    try {
        await fileService.createFolder(newPath);
        if (currentFolder) {
             const updatedFiles = await fileService.scanFolder(currentFolder);
             setFiles(updatedFiles);
        }
    } catch (error: any) {
        console.error("Create folder failed", error);
        alert("Failed to create folder: " + error.message);
    }
    setContextMenu(null);
  };

  const handleContextMenu = (e: React.MouseEvent, file: any) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, file });
  };

  const handleRename = async () => {
    if (!contextMenu) return;
    const { file } = contextMenu;
    
    if (isGithub) {
      alert("Renaming files in GitHub repositories is not supported yet.");
      setContextMenu(null);
      return;
    }

    const newName = prompt("Enter new file name:", file.name);
    if (newName && newName !== file.name) {
        const pathParts = file.path.split('/');
        pathParts.pop();
        const newPath = [...pathParts, newName].join('/');
        
        try {
            await fileService.renameFile(file.path, newPath);
            if (currentFolder) {
                 const updatedFiles = await fileService.scanFolder(currentFolder);
                 setFiles(updatedFiles);
            }
        } catch (error: any) {
            console.error("Rename failed", error);
            alert("Failed to rename file: " + error.message);
        }
    }
    setContextMenu(null);
  };

  const handleDelete = async () => {
    if (!contextMenu) return;
    const { file } = contextMenu;
    
    if (isGithub) {
      alert("Deleting files in GitHub repositories is not supported yet.");
      setContextMenu(null);
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${file.name}?`)) {
        try {
            await fileService.deleteFile(file.path);
            if (currentFolder) {
                 const updatedFiles = await fileService.scanFolder(currentFolder);
                 setFiles(updatedFiles);
            }
        } catch (error: any) {
            console.error("Delete failed", error);
            alert("Failed to delete file: " + error.message);
        }
    }
    setContextMenu(null);
  };

  return (
    <div id="app-sidebar" className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-full overflow-y-auto flex flex-col">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button 
                className={`flex-1 py-2 text-xs font-medium transition-colors ${activeTab === 'files' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                onClick={() => setActiveTab('files')}
            >
                Explorer
            </button>
            <button 
                className={`flex-1 py-2 text-xs font-medium transition-colors ${activeTab === 'search' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                onClick={() => setActiveTab('search')}
            >
                Search
            </button>
            {isGithub && (
            <button 
                className={`flex-1 py-2 text-xs font-medium transition-colors ${activeTab === 'prs' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                onClick={() => { setActiveTab('prs'); handleGitAction('fetch-prs'); }}
            >
                PRs
            </button>
            )}
        </div>

      {activeTab === 'search' && (
        <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-left-4 duration-300">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
             <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Find in Files
            </h2>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search workspace..."
                className="w-full pl-8 pr-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-200"
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            <div className="relative mt-2">
              <Replace className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Replace with..."
                className="w-full pl-8 pr-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-200"
                value={replaceQuery}
                onChange={(e) => setReplaceQuery(e.target.value)}
              />
            </div>
            <button
              onClick={handleReplaceAll}
              disabled={!globalSearchQuery || !replaceQuery || isReplacing || isGithub}
              className="mt-2 w-full py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isReplacing ? <Loader size={12} className="animate-spin" /> : <Replace size={12} />}
              Replace All
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
             {globalSearchQuery && globalSearchResults.length === 0 && (
                <div className="text-center text-sm text-gray-500 mt-4">No results found</div>
             )}
             {globalSearchResults.map(file => (
               <button
                key={file.path}
                onClick={() => handleFileClick(file)}
                className="w-full text-left flex items-center py-2 px-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
               >
                 <FileText size={14} className="mr-2 flex-shrink-0 text-gray-400" />
                 <div className="truncate">
                   <div className="font-medium">{file.name}</div>
                   <div className="text-xs text-gray-400 truncate">{file.path}</div>
                 </div>
               </button>
             ))}
          </div>
        </div>
      )}

      {activeTab === 'files' ? (
      <>
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 animate-in fade-in duration-300">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Explorer
          </h2>
          <div className="flex gap-1">
            <button onClick={handleCollapseAll} className="text-gray-400 hover:text-blue-500" title="Collapse All Folders">
              <ListCollapse size={14} />
            </button>
            {isGithub && (
              <button onClick={() => handleGitAction('token')} className="text-gray-400 hover:text-blue-500" title="Set GitHub Token">
                <Key size={14} />
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-400 truncate mt-1 mb-3" title={currentFolder || ''}>
          {currentFolder ? currentFolder.split(/[/\\]/).pop() : 'No folder selected'}
        </p>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            className="w-full pl-8 pr-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {isGithub && (
          <div className="flex gap-1 mt-3 justify-between">
             <button onClick={() => handleGitAction('fetch')} disabled={gitLoading} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" title="Fetch"><RefreshCw size={14} /></button>
             <button onClick={() => handleGitAction('commit')} disabled={gitLoading} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" title="Commit & Push"><Upload size={14} /></button>
             <button onClick={() => handleGitAction('branch')} disabled={gitLoading} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" title="Create Branch"><GitBranch size={14} /></button>
             <button onClick={() => handleGitAction('pr')} disabled={gitLoading} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" title="Create PR"><GitPullRequest size={14} /></button>
             <button onClick={() => handleGitAction('merge')} disabled={gitLoading} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" title="Squash Merge"><GitMerge size={14} /></button>
          </div>
        )}
      </div>
      
      {showRecentInSidebar && recentFiles.length > 0 && !searchQuery && (
        <div className="border-b border-gray-200 dark:border-gray-800">
            <div className="px-4 py-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recent Files</h3>
                <button onClick={() => { setRecentFiles([]); localStorage.removeItem('recentFiles'); }} className="text-gray-400 hover:text-red-500" title="Clear Recent Files">
                    <Trash2 size={12} />
                </button>
            </div>
            <div className="max-h-32 overflow-y-auto">
                {recentFiles.slice(0, recentFilesLimit || 10).map(file => (
                    <button key={file.path} onClick={() => handleFileClick(file)} className="w-full text-left flex items-center py-1 px-4 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Clock size={12} className="mr-2 flex-shrink-0" />
                        <span className="truncate">{file.name}</span>
                    </button>
                ))}
            </div>
        </div>
      )}

      <div className="flex-1 p-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {!files && currentFolder ? <FileTreeSkeleton /> : (
        <div key={treeKey}>
        {Object.values(fileTree)
          .sort((a, b) => {
             if (a.type === b.type) return a.name.localeCompare(b.name);
             return a.type === 'dir' ? -1 : 1;
          })
          .map((node) => (
          <FileTreeItem
            key={node.path}
            node={node}
            depth={0}
            onSelect={handleFileClick}
            onContextMenu={handleContextMenu}
            currentFile={currentFile}
            loadingFile={loadingFile}
            isDirty={isDirty}
            defaultOpen={defaultOpen || !!searchQuery}
          />
        ))}
        {filteredFiles.length === 0 && searchQuery && (
          <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
            No files found
          </div>
        )}
        </div>
        )}
      </div>
      </>
      ) : (
        <div className="flex-1 overflow-y-auto animate-in fade-in slide-in-from-right-4 duration-300">
            {gitLoading && <div className="p-4 text-center"><Loader size={20} className="animate-spin mx-auto text-gray-400" /></div>}
            {!gitLoading && pullRequests.length === 0 && <div className="p-4 text-center text-sm text-gray-500">No open pull requests</div>}
            {pullRequests.map(pr => (
                <a key={pr.id} href={pr.html_url} target="_blank" rel="noopener noreferrer" className="block p-3 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 line-clamp-2">{pr.title}</div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <GitPullRequest size={12} className="mr-1" />
                        <span>#{pr.number} by {pr.user.login}</span>
                    </div>
                </a>
            ))}
        </div>
      )}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 min-w-[160px] animate-in fade-in zoom-in-95 duration-100"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            onClick={handleNewFolder}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <FolderPlus size={14} className="mr-2" />
            New Folder
          </button>
          <button
            onClick={handleRename}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <Edit size={14} className="mr-2" />
            Rename
          </button>
          <button
            onClick={handleDelete}
            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
          >
            <Trash2 size={14} className="mr-2" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
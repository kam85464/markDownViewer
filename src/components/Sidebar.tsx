import React, { useState, useMemo, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { FileText, FolderOpen, Search, Loader, ChevronRight, ChevronDown, GitBranch, GitPullRequest, GitCommit, GitMerge, RefreshCw, Upload, Check, Plus, Key, Circle } from 'lucide-react';
import { githubService } from '../services/githubService';

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
  currentFile: any;
  loadingFile: string | null;
  isDirty: boolean;
  defaultOpen?: boolean;
}> = ({ node, depth, onSelect, currentFile, loadingFile, isDirty, defaultOpen }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen || false);
  const isSelected = currentFile?.path === node.file?.path;
  const isModified = node.type === 'file' && isSelected && isDirty;

  if (node.type === 'file') {
    return (
      <button
        onClick={() => onSelect(node.file)}
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
        className="w-full text-left flex items-center py-1 px-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
        style={{ paddingLeft: `${depth * 12}px` }}
      >
        {isOpen ? <ChevronDown size={14} className="mr-1" /> : <ChevronRight size={14} className="mr-1" />}
        <FolderOpen size={14} className="mr-2 flex-shrink-0" />
        <span className="truncate">{node.name}</span>
      </button>
      {isOpen && (
        <div>
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

export const Sidebar: React.FC = () => {
  const { files, currentFile, selectFile, currentFolder, setMarkdownContent, markdownContent, originalContent } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingFile, setLoadingFile] = useState<string | null>(null);
  const [gitLoading, setGitLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'files' | 'prs'>('files');
  const [pullRequests, setPullRequests] = useState<any[]>([]);
  const isDirty = !!currentFile && markdownContent !== originalContent;

  const filteredFiles = files ? files.filter(file =>
    file.path.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

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

  return (
    <div id="app-sidebar" className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-full overflow-y-auto flex flex-col">
      {isGithub && (
        <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button 
                className={`flex-1 py-2 text-xs font-medium transition-colors ${activeTab === 'files' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                onClick={() => setActiveTab('files')}
            >
                Files
            </button>
            <button 
                className={`flex-1 py-2 text-xs font-medium transition-colors ${activeTab === 'prs' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                onClick={() => { setActiveTab('prs'); handleGitAction('fetch-prs'); }}
            >
                Pull Requests
            </button>
        </div>
      )}

      {activeTab === 'files' ? (
      <>
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Explorer
          </h2>
          {isGithub && (
            <button onClick={() => handleGitAction('token')} className="text-gray-400 hover:text-blue-500" title="Set GitHub Token">
              <Key size={14} />
            </button>
          )}
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
      
      <div className="flex-1 p-2">
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
            currentFile={currentFile}
            loadingFile={loadingFile}
            isDirty={isDirty}
            defaultOpen={!!searchQuery}
          />
        ))}
        {filteredFiles.length === 0 && searchQuery && (
          <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
            No files found
          </div>
        )}
      </div>
      </>
      ) : (
        <div className="flex-1 overflow-y-auto">
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
    </div>
  );
};
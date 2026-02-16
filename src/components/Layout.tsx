import React, { useEffect, useState, useRef } from 'react';
import { Save, X, FileText, FolderOpen, Clock, Trash2, FilePlus, Pin, PinOff, FolderSearch, BookOpen, Lightbulb, FileCode, PenTool, BookOpenText, Scroll, Apple, AppWindow, Cpu, Car, Smartphone, Gamepad2, Watch, Headphones, Github, Loader, ArrowRight, LayoutTemplate } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Toolbar } from './Toolbar';
import { Tabs } from './Tabs';
import { StatusBar } from './StatusBar';
import { Presentation } from './Presentation';
import { ErrorBoundary } from './ErrorBoundary';
import { TableOfContents } from './TableOfContents';
import { useAppStore } from '../store/useAppStore';
import { EditorPane } from './EditorPane';
import { PreviewPane } from './PreviewPane';
import { SettingsModal } from './SettingsModal';
import { fileService } from '../services/fileService';
import { githubService } from '../services/githubService';


const TIPS = [
  "Tip: Drag and drop folders to open them instantly.",
  "Tip: Use Ctrl+P (Cmd+P) to quickly search for files.",
  "Tip: Enable Vim Mode in settings for keyboard-driven editing.",
  "Tip: Right-click tabs to access more options like 'Close Others'.",
  "Quote: \"Simplicity is the soul of efficiency.\" – Austin Freeman",
  "Quote: \"Code is like humor. When you have to explain it, it’s bad.\" – Cory House",
  "Tip: You can export your markdown to PDF or HTML from the toolbar.",
  "Tip: Toggle Zen Mode to remove distractions.",
  "Tip: Use the Command Palette (F1) to access all features quickly.",
  "Quote: \"First, solve the problem. Then, write the code.\" – John Johnson",
  "Quote: \"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.\" – Martin Fowler",
  "Tip: Customize the editor theme and font in settings for a personalized experience.",
  "Tip: Use the built-in markdown syntax guide for quick reference.",
  "Tip: Enable Auto-Save to never worry about losing your work.",
  "Tip: Use the Split View to edit and preview side by side.",
  "Quote: \"Programming isn't about what you know; it's about what you can figure out.\" – Chris Pine",
  "Quote: \"The best way to get a project done faster is to start sooner.\" – Jim Highsmith",
  "Tip: Use the integrated terminal for running scripts without leaving the app.",
  "Tip: You can sync scroll between editor and preview for better navigation.",
  "Tip: Use the 'Find in Files' feature to search across all your markdown files.",
  "Quote: \"Simplicity is the ultimate sophistication.\" – Leonardo da Vinci",
  "Quote: \"Code never lies, comments sometimes do.\" – Ron Jeffries",
  "Tip: Regularly check for updates to get new features and improvements.",
  "Tip: Use the 'Focus Mode' to dim everything except the current line for better concentration.",
  "Tip: You can customize keyboard shortcuts in the settings to match your workflow.",
  "Tip: Use the 'Zen Mode' to hide all UI elements and immerse yourself in writing.",
  "Quote: \"The only way to learn a new programming language is by writing programs in it.\" – Dennis Ritchie",
  "Quote: \"Experience is the name everyone gives to their mistakes.\" – Oscar Wilde",
  "Tip: Use the 'Word Count Goal' feature to set writing targets and track your progress.",
  "Tip: You can preview your markdown in different themes to see how it will look on various platforms.",
  "Tip: Use the 'Version History' feature to keep track of changes and revert to previous versions if needed.",
  "Quote: \"Programming is not about typing, it's about thinking.\" – Rich Hickey",
  "Quote: \"The most disastrous thing that you can ever learn is your first programming language.\" – Alan Kay",
  "Tip: Use the 'Markdown Linting' feature to ensure your markdown follows best practices and is free of common errors.",
  "Tip: You can customize the CSS for the preview pane to make it look exactly how you want.",
  "Tip: Use the 'Export' feature to save your markdown as PDF, HTML, or even DOCX for sharing with others.",
  "Quote: \"Code is like a poem; it has to follow certain rhythms and patterns to be beautiful.\" – Unknown",
];

const TEMPLATES = [
  {
    name: 'README',
    filename: 'README.md',
    content: '# Project Name\n\nDescription of your project.\n\n## Installation\n\n```bash\nnpm install\n```\n\n## Usage\n\n```javascript\nimport myLib from "my-lib";\n```'
  },
  {
    name: 'Blog Post',
    filename: 'blog-post.md',
    content: '---\ntitle: My Blog Post\ndate: 2023-01-01\n---\n\n# My Blog Post\n\nWrite your content here...'
  },
  {
    name: 'To-Do List',
    filename: 'todo.md',
    content: '# To-Do List\n\n- [ ] Task 1\n- [ ] Task 2\n- [x] Completed Task'
  }
];

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const ParticleBackground: React.FC<{ colors: string[] }> = ({ colors }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{x: number, y: number, dx: number, dy: number, size: number}> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const createParticles = () => {
      particles = [];
      const particleCount = 50;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          dx: (Math.random() - 0.5) * 0.5,
          dy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1
        });
      }
    };
    createParticles();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = document.documentElement.classList.contains('dark');
      const primaryColor = colors[0] || '#60a5fa';
      ctx.fillStyle = isDark ? hexToRgba(primaryColor, 0.2) : hexToRgba(primaryColor, 0.4);
      ctx.strokeStyle = isDark ? hexToRgba(primaryColor, 0.05) : hexToRgba(primaryColor, 0.1);
      
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        // Mouse interaction
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 150) {
          ctx.beginPath();
          ctx.strokeStyle = isDark ? hexToRgba(primaryColor, 0.15) : hexToRgba(primaryColor, 0.25);
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.stroke();
          
          // Gentle repel effect
          if (distance < 100) {
             const force = (100 - distance) / 100;
             const angle = Math.atan2(dy, dx);
             p.x -= Math.cos(angle) * force * 2;
             p.y -= Math.sin(angle) * force * 2;
          }
        }
      });
      
      for(let i=0; i<particles.length; i++) {
        for(let j=i+1; j<particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [colors]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
};

const AuroraBackground: React.FC<{ colors: string[] }> = ({ colors }) => {
  const c1 = colors[0] || '#60a5fa';
  const c2 = colors[1] || '#a78bfa';
  const c3 = colors[2] || '#f472b6';
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-[spin_20s_linear_infinite] blur-3xl opacity-50 dark:opacity-30" style={{ background: `linear-gradient(to bottom right, ${hexToRgba(c1, 0.2)}, ${hexToRgba(c2, 0.2)}, ${hexToRgba(c3, 0.2)})` }} />
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-[spin_15s_linear_infinite_reverse] blur-3xl opacity-50 dark:opacity-30" style={{ background: `linear-gradient(to top left, ${hexToRgba(c3, 0.2)}, ${hexToRgba(c1, 0.2)}, ${hexToRgba(c2, 0.2)})` }} />
    </div>
  );
};

const GridBackground: React.FC<{ colors: string[] }> = ({ colors }) => {
  const c1 = colors[0] || '#60a5fa';
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" 
         style={{ 
           backgroundImage: `linear-gradient(${hexToRgba(c1, 0.1)} 1px, transparent 1px), linear-gradient(90deg, ${hexToRgba(c1, 0.1)} 1px, transparent 1px)`, 
           backgroundSize: '40px 40px',
           maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
         }} 
    />
  );
};

export const Layout: React.FC = () => { 
  const {
    isEditing,
    showTOC,
    toggleTOC,
    autoSaveEnabled,
    saveCurrentFile,
    markdownContent,
    originalContent,
    currentFile,
    isDistractionFreeMode,
    splitDirection,
    setFolder,
    setFiles,
    loadRecentFolders,
    recentFolders,
    selectFile,
    setMarkdownContent,
    isFocusMode,
    isTyping,
    files,
    currentFolder,
    backgroundAnimation,
    backgroundAnimationColors,
    showDailyQuote
  } = useAppStore();

  const [showDisclaimer, setShowDisclaimer] = useState(() => {
    return localStorage.getItem('disclaimer-dismissed') !== 'true';
  });
  const [pinnedFolders, setPinnedFolders] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('pinnedFolders') || '[]');
    } catch {
      return [];
    }
  });
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; path: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [dailyTip, setDailyTip] = useState("");
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [githubUrl, setGithubUrl] = useState("");
  const [isLoadingGithub, setIsLoadingGithub] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [randomAnimation, setRandomAnimation] = useState<string>('particles');

  useEffect(() => {
    if (backgroundAnimation === 'random') {
      const animations = ['particles', 'aurora', 'grid'];
      setRandomAnimation(animations[Math.floor(Math.random() * animations.length)]);
    }
  }, [backgroundAnimation]);

  const activeAnimation = backgroundAnimation === 'random' ? randomAnimation : backgroundAnimation;

  useEffect(() => {
    setDailyTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
  }, []);

  useEffect(() => {
    if (!markdownContent) return;
    const hasHeaders = /^#{1,6}\s/m.test(markdownContent);
    if (hasHeaders && !showTOC) {
      toggleTOC();
    } else if (!hasHeaders && showTOC) {
      toggleTOC();
    }
  }, [markdownContent, currentFile]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setIsSidebarVisible(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!autoSaveEnabled || !currentFile || markdownContent === originalContent) return;

    const timer = setTimeout(() => {
      saveCurrentFile();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenFolder = async () => {
    const path = await fileService.selectFolder();
    if (path) {
      setFolder(path);
      setFiles(null as any);
      const files = await fileService.scanFolder(path);
      setFiles(files);
      loadRecentFolders();
    }
  };

  const handleRecentClick = async (path: string) => {
    try {
      setFolder(path);
      setFiles(null as any);
      const files = await fileService.scanFolder(path);
      setFiles(files);
    } catch (error) {
      console.error('Failed to open recent folder:', error);
    }
  };

  const handleClearRecent = () => {
    localStorage.removeItem('recentFolders');
    loadRecentFolders();
  };

  const handleNewFile = () => {
    setMarkdownContent('');
    selectFile({ name: 'Untitled', path: '', parent: '' });
  };

  const handleTemplateSelect = (template: typeof TEMPLATES[0]) => {
    setMarkdownContent(template.content);
    selectFile({ name: template.filename, path: `untitled:${template.filename}`, parent: '' });
    setShowTemplates(false);
  };

  const handleQuickStart = async () => {
    const content = `# Quick Start Guide

Welcome to **Markdown Viewer Pro**!

## 🚀 Getting Started

1. **Open a Folder**: Click the folder icon in the toolbar or drag a folder into the window.
2. **Create a File**: Click the "New File" button or use the context menu in the file explorer.
3. **Edit**: Just start typing! The preview updates automatically.

## ⌨️ Key Shortcuts

| Action | Shortcut |
|--------|----------|
| Save | \`Ctrl/Cmd + S\` |
| Find File | \`Ctrl/Cmd + P\` |
| Command Palette | \`F1\` |
| Toggle Sidebar | \`Ctrl/Cmd + B\` |
| Toggle Table of Contents | \`Ctrl/Cmd + T\` |
| Toggle Zen Mode | \`Ctrl/Cmd + Shift + Z\` |
| Toggle Focus Mode | \`Ctrl/Cmd + Shift + F\` |
| Toggle Auto-Save | \`Ctrl/Cmd + Shift + A\` |


Enjoy writing!
`;
    await selectFile({ name: 'Quick Start.md', path: 'untitled:Quick Start.md', parent: '' });
    setMarkdownContent(content);
  };

  const handleLoadFromGithubHome = async () => {
    if (!githubUrl) return;
    setIsLoadingGithub(true);
    setFiles(null as any);
    try {
      const result = await githubService.loadFromUrl(githubUrl);
      if (result.type === 'file' && result.content) {
        setMarkdownContent(result.content);
        selectFile({
            name: githubUrl.split('/').pop() || 'github-file.md',
            path: githubUrl,
            isGithub: true
        });
      } else if (result.type === 'dir' && result.files) {
        setFiles(result.files as any);
        setFolder(githubUrl);
      }
    } catch (error) {
      console.error("GitHub load error:", error);
      alert("Failed to load from GitHub. Check console for details.");
    } finally {
      setIsLoadingGithub(false);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, path });
  };

  const handlePinToggle = (path: string) => {
    let newPinned;
    if (pinnedFolders.includes(path)) {
      newPinned = pinnedFolders.filter(p => p !== path);
    } else {
      newPinned = [...pinnedFolders, path];
    }
    setPinnedFolders(newPinned);
    localStorage.setItem('pinnedFolders', JSON.stringify(newPinned));
    setContextMenu(null);
  };

  const handleRemoveRecent = (path: string) => {
    const recent = JSON.parse(localStorage.getItem('recentFolders') || '[]');
    const newRecent = recent.filter((f: string) => f !== path);
    localStorage.setItem('recentFolders', JSON.stringify(newRecent));
    
    // Also remove from pinned if present
    if (pinnedFolders.includes(path)) {
      const newPinned = pinnedFolders.filter(p => p !== path);
      setPinnedFolders(newPinned);
      localStorage.setItem('pinnedFolders', JSON.stringify(newPinned));
    }

    loadRecentFolders();
    setContextMenu(null);
  };

  const handleRevealInExplorer = (path: string) => {
    fileService.showItemInFolder(path);
    setContextMenu(null);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      // @ts-ignore - Electron adds 'path' to File object
      const path = file.path;
      if (path) {
        handleRecentClick(path);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const sortedRecentFolders = [...recentFolders].sort((a, b) => {
    const isAPinned = pinnedFolders.includes(a);
    const isBPinned = pinnedFolders.includes(b);
    if (isAPinned === isBPinned) return 0;
    return isAPinned ? -1 : 1;
  });

  const dimClass = isFocusMode && isTyping ? 'opacity-10 transition-opacity duration-500 delay-100' : 'opacity-100 transition-opacity duration-200';

  const showEditor = isEditing && !!currentFile;
  const showSidebar = !isDistractionFreeMode && isSidebarVisible && (!!currentFolder || (!!files && files.length > 0));
  const showTOCPanel = showTOC && !isDistractionFreeMode && !!currentFile;

  const renderBackground = () => {
    switch (activeAnimation) {
      case 'aurora': return <AuroraBackground colors={backgroundAnimationColors} />;
      case 'grid': return <GridBackground colors={backgroundAnimationColors} />;
      case 'none': return null;
      case 'particles':
      default: return <ParticleBackground colors={backgroundAnimationColors} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#fcfcfc] dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* {isPresentationMode && <Presentation />} */}
      <SettingsModal />
      <div className={dimClass}>
        <Toolbar />
      </div>
      <div className="flex flex-1 overflow-hidden">

        {showSidebar && <div className={`${dimClass} animate-in slide-in-from-left duration-300`}><Sidebar /></div>}
        <main id="app-main-content" className="flex-1 flex flex-col overflow-hidden relative"> 
          {!isDistractionFreeMode && <div className={`${dimClass} animate-in slide-in-from-top duration-300`}><Tabs /></div>}
          <div className="flex flex-1 overflow-hidden relative">
          <div className={`flex-1 flex overflow-hidden relative ${splitDirection === 'horizontal' ? 'flex-col' : 'flex-row'}`}>
            {showEditor && (
            <div className={`${splitDirection === 'horizontal' ? 'h-1/2 w-full border-b' : 'w-1/2 h-full border-r'} border-gray-200 dark:border-gray-700`}>
              <ErrorBoundary name="Editor">
                <EditorPane />
              </ErrorBoundary>
            </div>
          )}
            <div className={`${showEditor ? (splitDirection === 'horizontal' ? 'h-1/2 w-full' : 'w-1/2 h-full') : 'w-full h-full'} relative ${dimClass}`}>
              <ErrorBoundary name="Preview">
                <PreviewPane />
              </ErrorBoundary>
              <div 
                className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${currentFile ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'} bg-gradient-to-br from-[#fcfcfc]/90 via-[#f1f5f9]/90 to-[#e2e8f0]/90 dark:from-gray-900/90 dark:via-gray-800/90 dark:to-gray-900/90 backdrop-blur-md z-10`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                  {renderBackground()}
                  
                  <div className="z-20 flex flex-col items-center max-w-2xl w-full px-6 animate-in fade-in zoom-in-95 duration-500">
                      <div className="relative group cursor-default mb-10" style={{ perspective: '1000px' }}>
                        <div className="absolute -inset-20 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100 animate-pulse"></div>
                        <div className="relative transform transition-all duration-700 group-hover:rotate-3 group-hover:scale-110">
                           <div className="relative z-20">
                              <FileCode strokeWidth={1.5} size={130} className="text-gray-800 dark:text-gray-100 drop-shadow-2xl transition-colors duration-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                           </div>
                           
                           {/* Tech Giants & Gadgets Animations */}
                           <div className="absolute -top-10 -left-10 z-30 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-75 group-hover:-translate-y-6 group-hover:-translate-x-6">
                               <Apple size={32} className="text-gray-900 dark:text-white drop-shadow-md animate-bounce" />
                           </div>
                           <div className="absolute -top-8 -right-12 z-10 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 group-hover:-translate-y-8 group-hover:translate-x-8">
                                <AppWindow size={34} className="text-blue-500 drop-shadow-md animate-pulse" />
                           </div>
                           <div className="absolute top-1/2 -left-16 z-30 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-150 group-hover:-translate-x-10">
                                <Cpu size={30} className="text-green-500 drop-shadow-md animate-[spin_3s_linear_infinite]" />
                           </div>
                           <div className="absolute -bottom-6 -left-10 z-30 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200 group-hover:translate-y-6 group-hover:-translate-x-8">
                                <Car size={36} className="text-red-500 drop-shadow-md" />
                           </div>
                           <div className="absolute top-1/3 -right-16 z-10 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-300 group-hover:translate-x-10">
                                <Smartphone size={28} className="text-purple-500 drop-shadow-md -rotate-12 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                           </div>
                           <div className="absolute -bottom-4 -right-6 z-30 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-400 group-hover:translate-y-8 group-hover:translate-x-8">
                                <Gamepad2 size={32} className="text-indigo-500 drop-shadow-md rotate-12 hover:rotate-45 transition-transform duration-300" />
                           </div>
                           <div className="absolute -top-12 left-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-500 group-hover:-translate-y-10">
                                <Watch size={26} className="text-orange-500 drop-shadow-md animate-bounce" style={{ animationDelay: '0.5s' }} />
                           </div>
                           <div className="absolute -bottom-10 left-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-500 group-hover:translate-y-10">
                                <Headphones size={28} className="text-pink-500 drop-shadow-md animate-pulse" />
                           </div>

                           <div className="absolute bottom-0 -right-8 z-40 transition-all duration-500 group-hover:translate-x-8 group-hover:-translate-y-4 group-hover:rotate-12">
                              <PenTool strokeWidth={1.5} size={50} className="text-blue-600 dark:text-blue-400 drop-shadow-lg transform -rotate-12" fill="currentColor" fillOpacity={0.1} />
                           </div>
                           <FileCode strokeWidth={1.5} size={130} className="text-blue-500/20 absolute top-3 left-3 z-0 blur-sm transition-all duration-500 group-hover:translate-x-3 group-hover:translate-y-3" />
                        </div>
                      </div>
                      
                      <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 tracking-tight text-center drop-shadow-sm">
                        Markdown Viewer Pro
                      </h1>
                      <p className="text-gray-600 dark:text-gray-300 mb-12 text-xl text-center font-light max-w-lg leading-relaxed">
                        Visualize your ideas with power, simplicity, and elegance.
                      </p>
                      
                      <div className="flex gap-6 mb-16">
                        <button 
                          onClick={handleOpenFolder}
                          className="group relative px-8 py-4 bg-blue-600 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                          <div className="flex items-center gap-3">
                            <FolderOpen size={22} />
                            <span>Open Folder</span>
                          </div>
                        </button>
                        <button 
                          onClick={handleNewFile}
                          className="group px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-2xl font-semibold text-lg shadow-lg shadow-gray-200/50 dark:shadow-none hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1"
                        >
                          <div className="flex items-center gap-3">
                            <FilePlus size={22} className="group-hover:text-blue-500 transition-colors" />
                            <span>New File</span>
                          </div>
                        </button>
                        <button 
                          onClick={handleQuickStart}
                          className="group px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-2xl font-semibold text-lg shadow-lg shadow-gray-200/50 dark:shadow-none hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1"
                        >
                          <div className="flex items-center gap-3">
                            <BookOpen size={22} className="group-hover:text-blue-500 transition-colors" />
                            <span>Quick Start</span>
                          </div>
                         </button>
                         <button 
                           onClick={() => setShowTemplates(true)}
                           className="group px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-2xl font-semibold text-lg shadow-lg shadow-gray-200/50 dark:shadow-none hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1"
                         >
                           <div className="flex items-center gap-3">
                             <LayoutTemplate size={22} className="group-hover:text-blue-500 transition-colors" />
                             <span>From Template</span>
                           </div>
                        </button>
                      </div>

                      <div className="w-full max-w-lg mb-12 relative group animate-in fade-in slide-in-from-bottom-4 duration-700 delay-75">
                          <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                          <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-xl p-2 shadow-lg border border-gray-100 dark:border-gray-700">
                            <div className="p-2 text-gray-400">
                              <Github size={20} />
                            </div>
                            <input 
                              type="text" 
                              placeholder="Paste GitHub repository or file URL..." 
                              className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 px-2"
                              value={githubUrl}
                              onChange={(e) => setGithubUrl(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleLoadFromGithubHome()}
                            />
                            <button 
                              onClick={handleLoadFromGithubHome}
                              disabled={!githubUrl || isLoadingGithub}
                              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {isLoadingGithub ? <Loader size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                            </button>
                          </div>
                       </div>

                      {recentFolders.length > 0 && (
                        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                          <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Recent Workspaces</h3>
                            <button 
                              onClick={handleClearRecent}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Clear Recent"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 dark:border-gray-700/50 overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
                            {sortedRecentFolders.slice(0, 5).map((folder, i) => (
                              <button
                                key={i}
                                onClick={() => handleRecentClick(folder)}
                                onContextMenu={(e) => handleContextMenu(e, folder)}
                                className="w-full text-left px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 border-b border-gray-100/50 dark:border-gray-700/50 last:border-0 flex items-center transition-all group relative overflow-hidden"
                              >
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                {pinnedFolders.includes(folder) ? (
                                  <Pin size={16} className="mr-4 text-blue-500 fill-blue-500/20" />
                                ) : (
                                  <Clock size={16} className="mr-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                )}
                                <span className="truncate font-medium opacity-90 group-hover:opacity-100 transition-opacity">{folder}</span>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
                                    <FolderOpen size={14} />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {showDailyQuote && (
                        <div className="mt-12 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 bg-white/40 dark:bg-gray-800/40 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20 dark:border-gray-700/30 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                          <Lightbulb size={16} className="text-yellow-500" />
                          <span className="italic">{dailyTip}</span>
                        </div>
                      )}
                  </div>

                  {contextMenu && (
                    <div 
                      ref={menuRef}
                      className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 min-w-[180px] animate-in fade-in zoom-in-95 duration-100"
                      style={{ top: contextMenu.y, left: contextMenu.x }}
                    >
                      <button 
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 flex items-center transition-colors"
                        onClick={() => {
                          handleRecentClick(contextMenu.path);
                          setContextMenu(null);
                        }}
                      >
                        <FolderOpen size={16} className="mr-3" />
                        Open
                      </button>
                      <button 
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 flex items-center transition-colors"
                        onClick={() => handleRevealInExplorer(contextMenu.path)}
                      >
                        <FolderSearch size={16} className="mr-3" />
                        Reveal in Explorer
                      </button>
                      <button 
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 flex items-center transition-colors"
                        onClick={() => handlePinToggle(contextMenu.path)}
                      >
                        {pinnedFolders.includes(contextMenu.path) ? <PinOff size={16} className="mr-3" /> : <Pin size={16} className="mr-3" />}
                        {pinnedFolders.includes(contextMenu.path) ? "Unpin" : "Pin to Recent"}
                      </button>
                      <div className="h-px bg-gray-100 dark:bg-gray-700 my-1 mx-1" />
                      <button 
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center transition-colors"
                        onClick={() => handleRemoveRecent(contextMenu.path)}
                      >
                        <Trash2 size={16} className="mr-3" />
                        Remove from Recent
                      </button>
                    </div>
                  )}
              </div>
            </div>
          </div>
          {showTOCPanel && <div className={`${dimClass} h-full animate-in slide-in-from-right duration-300`}><TableOfContents /></div>}
          </div>
        </main>
      </div>
      
      <div className={`bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-3 py-0.5 text-[10px] text-gray-400 flex justify-between items-center ${dimClass}`}>
        {showDisclaimer ? (
          <div className="flex items-center gap-2">
            <span>Disclaimer: This application is provided "as is" without warranty.</span>
            <button 
              onClick={() => { setShowDisclaimer(false); localStorage.setItem('disclaimer-dismissed', 'true'); }} 
              className="hover:text-gray-600 dark:hover:text-gray-200"
              title="Dismiss"
            >
              <X size={10} />
            </button>
          </div>
        ) : <div />}
        {!isDistractionFreeMode && <StatusBar />}
      </div>
    </div>
  );
};
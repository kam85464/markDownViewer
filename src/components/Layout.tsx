import React, { useEffect, useState, useRef } from 'react';
import { Save, X, FileText, FolderOpen, Clock, Trash2 } from 'lucide-react';
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


const ParticleBackground: React.FC = () => {
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
      ctx.fillStyle = isDark ? 'rgba(100, 149, 237, 0.2)' : 'rgba(100, 149, 237, 0.4)';
      ctx.strokeStyle = isDark ? 'rgba(100, 149, 237, 0.05)' : 'rgba(100, 149, 237, 0.1)';
      
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
          ctx.strokeStyle = isDark ? 'rgba(100, 149, 237, 0.15)' : 'rgba(100, 149, 237, 0.25)';
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
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
};

export const Layout: React.FC = () => { 
  const {
    isEditing,
    showTOC,
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
    recentFolders
  } = useAppStore();

  const [showDisclaimer, setShowDisclaimer] = useState(() => {
    return localStorage.getItem('disclaimer-dismissed') !== 'true';
  });

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
    } catch (error) {
      console.error('Failed to open recent folder:', error);
    }
  };

  const handleClearRecent = () => {
    localStorage.removeItem('recentFolders');
    loadRecentFolders();
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* {isPresentationMode && <Presentation />} */}
      <SettingsModal />
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">

        {!isDistractionFreeMode && <Sidebar />}
        <main id="app-main-content" className="flex-1 flex flex-col overflow-hidden relative"> 
          {!isDistractionFreeMode && <Tabs />}
          <div className={`flex-1 flex overflow-hidden relative ${splitDirection === 'horizontal' ? 'flex-col' : 'flex-row'}`}>
            {isEditing && (
            <div className={`${splitDirection === 'horizontal' ? 'h-1/2 w-full border-b' : 'w-1/2 h-full border-r'} border-gray-200 dark:border-gray-700`}>
              <ErrorBoundary name="Editor">
                <EditorPane />
              </ErrorBoundary>
            </div>
          )}
            <div className={`${isEditing ? (splitDirection === 'horizontal' ? 'h-1/2 w-full' : 'w-1/2 h-full') : 'w-full h-full'} relative`}>
              <ErrorBoundary name="Preview">
                <PreviewPane />
              </ErrorBoundary>
              <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${currentFile ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'} bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm z-10`}>
                  <ParticleBackground />
                  <div className="relative group cursor-default" style={{ perspective: '1000px' }}>
                    <div className="absolute -inset-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 group-hover:opacity-40 blur-2xl transition-opacity duration-500 animate-pulse"></div>
                    <div className="relative transform transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110">
                       <FileText strokeWidth={1} size={140} className="text-gray-800 dark:text-gray-100 relative z-10 drop-shadow-2xl" />
                       <FileText strokeWidth={1} size={140} className="text-blue-500/30 absolute top-2 left-2 z-0 blur-[2px]" />
                    </div>
                  </div>
                  <h1 className="text-4xl font-bold mt-8 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight">Markdown Viewer Pro</h1>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">Visualize your ideas with power and simplicity</p>
                  
                  <button 
                    onClick={handleOpenFolder}
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-blue-500/40 hover:-translate-y-1 active:translate-y-0"
                  >
                    <FolderOpen size={24} />
                    Open Folder
                  </button>

                  {recentFolders.length > 0 && (
                    <div className="mt-12 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 z-10">
                      <div className="flex items-center justify-between mb-3 px-1">
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recent Folders</h3>
                        <button 
                          onClick={handleClearRecent}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                          title="Clear Recent"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                        {recentFolders.slice(0, 5).map((folder, i) => (
                          <button
                            key={i}
                            onClick={() => handleRecentClick(folder)}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-b border-gray-100 dark:border-gray-700/50 last:border-0 flex items-center transition-colors group"
                          >
                            <Clock size={14} className="mr-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            <span className="truncate opacity-80 group-hover:opacity-100 transition-opacity">{folder}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-3 py-0.5 text-[10px] text-gray-400 flex justify-between items-center">
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
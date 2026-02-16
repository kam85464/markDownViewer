import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { createMarkdownParser } from '../services/markdownService';
import plantumlEncoder from 'plantuml-encoder';
import { toPng, toJpeg } from 'html-to-image';
import { Download, Image as ImageIcon, Copy, Loader, ArrowUp } from 'lucide-react';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';

export const PreviewPane: React.FC = () => {
  const { markdownContent, plugins, isSyncScroll, customCSS } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const isScrollingFromEditor = useRef(false);
  const [isRenderingMermaid, setIsRenderingMermaid] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);


  // Re-create the markdown parser whenever the plugins list changes
  const md = useMemo(() => createMarkdownParser(plugins), [plugins]);

  useEffect(() => {
    import('mermaid').then(m => {
      try {
        m.default.initialize({
          startOnLoad: false,
          theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
        });
      } catch (e) {
        console.warn("Mermaid init error:", e);
      }
    });
  }, []);


  useEffect(() => {
    if (contentRef.current) {
      const renderMermaid = async () => {
        try {
          const ref = contentRef.current;
          if (!ref) return;

          setError(null);
          // 1. Render Markdown
          ref.innerHTML = md.render(markdownContent || '');

          // 2. Render Mermaid Diagrams (only if the plugin is enabled and nodes exist)
          const mermaidNodes = ref.querySelectorAll('.mermaid');
          if (mermaidNodes.length > 0) {
            setIsRenderingMermaid(true);
            try {
              const mermaid = (await import('mermaid')).default;
              await mermaid.run({
                nodes: Array.from(mermaidNodes) as any,
              });
            } catch (err) {
              console.error('Mermaid error:', err);
              setError("Failed to render mermaid diagram.");
            } finally {
              setIsRenderingMermaid(false);
            }
          }

          // 3. Render PlantUML diagrams
          const plantUMLNodes = ref.querySelectorAll('div.plantuml');
          plantUMLNodes.forEach(node => {
            if (node.textContent) {
              const encoded = plantumlEncoder.encode(node.textContent);
              const url = `https://www.plantuml.com/plantuml/svg/${encoded}`;
              const img = document.createElement('img');
              img.src = url;
              node.innerHTML = '';
              node.appendChild(img);
            }
          });

          // 4. Add Copy Code buttons
          const preBlocks = ref.querySelectorAll('pre');
          preBlocks.forEach(pre => {
             if (pre.querySelector('.copy-btn')) return;
             
             const actions = document.createElement('div');
             actions.className = 'absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200';

             const collapseBtn = document.createElement('button');
             collapseBtn.className = 'collapse-btn p-1.5 rounded-md bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-200';
             collapseBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>';
             collapseBtn.title = 'Collapse';

             const copyBtn = document.createElement('button');
             copyBtn.className = 'copy-btn p-1.5 rounded-md bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-200';
             copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
             copyBtn.title = 'Copy Code';
             
             pre.classList.add('group', 'relative');
             
             let isCollapsed = false;
             const originalMaxHeight = pre.style.maxHeight;
             const originalOverflow = pre.style.overflow;

             collapseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                isCollapsed = !isCollapsed;
                if (isCollapsed) {
                    pre.style.maxHeight = '3rem';
                    pre.style.overflow = 'hidden';
                    collapseBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
                    collapseBtn.title = 'Expand';
                    actions.classList.remove('opacity-0', 'group-hover:opacity-100');
                    actions.classList.add('opacity-100');
                } else {
                    pre.style.maxHeight = originalMaxHeight;
                    pre.style.overflow = originalOverflow;
                    collapseBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>';
                    collapseBtn.title = 'Collapse';
                    actions.classList.remove('opacity-100');
                    actions.classList.add('opacity-0', 'group-hover:opacity-100');
                }
             });

             copyBtn.addEventListener('click', async () => {
                const code = pre.querySelector('code')?.innerText || pre.innerText;
                await navigator.clipboard.writeText(code);
                copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                copyBtn.classList.add('text-green-400');
                setTimeout(() => {
                   copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
                   copyBtn.classList.remove('text-green-400');
                }, 2000);
             });

             actions.appendChild(collapseBtn);
             actions.appendChild(copyBtn);
             pre.appendChild(actions);
          });

          // 5. Open external links in new tab
          const links = ref.querySelectorAll('a');
          links.forEach(link => {
             const href = link.getAttribute('href');
             if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
                 link.setAttribute('target', '_blank');
                 link.setAttribute('rel', 'noopener noreferrer');
             }
          });
        } catch (e) {
          console.error("Markdown render error:", e);
          setError("Failed to render markdown content.");
        }
      };

      renderMermaid();
    }
  }, [markdownContent, md]); // Re-render when content OR parser changes

  useEffect(() => {
    const handleScrollSync = (e: Event) => {
      if (!isSyncScroll || !scrollRef.current) return;
      isScrollingFromEditor.current = true;
      const customEvent = e as CustomEvent;
      const percentage = customEvent.detail;
      scrollRef.current.scrollTop = percentage * (scrollRef.current.scrollHeight - scrollRef.current.clientHeight);
      setTimeout(() => { isScrollingFromEditor.current = false; }, 50);
    };

    window.addEventListener('editor-scroll', handleScrollSync);
    return () => window.removeEventListener('editor-scroll', handleScrollSync);
  }, [isSyncScroll]);

  const handleScroll = () => {
    if (scrollRef.current) {
      setShowScrollTop(scrollRef.current.scrollTop > 300);
    }

    if (!isSyncScroll || !scrollRef.current || isScrollingFromEditor.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const maxScroll = scrollHeight - clientHeight;
    const percentage = maxScroll > 0 ? scrollTop / maxScroll : 0;
    
    window.dispatchEvent(new CustomEvent('preview-scroll', { detail: percentage }));
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExport = async (type: 'png' | 'jpeg') => {
    if (!contentRef.current) return;
    try {
      const isDark = document.documentElement.classList.contains('dark');
      const backgroundColor = isDark ? '#111827' : '#ffffff';
      
      const options = { backgroundColor, quality: 0.95 };
      const dataUrl = type === 'png' 
        ? await toPng(contentRef.current, options) 
        : await toJpeg(contentRef.current, options);
        
      const link = document.createElement('a');
      link.download = `export-${Date.now()}.${type}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed', err);
      setError("Failed to export image.");
    }
  };

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
    } catch (err) {
      console.error('Failed to copy content', err);
    }
  };

  if (error) {
    return <div className="h-full w-full p-8 text-red-500 bg-white dark:bg-gray-900">{error}</div>;
  }

  return (
    <div className="relative h-full w-full bg-[#fcfcfc] dark:bg-gray-900">
      {customCSS && <style>{customCSS}</style>}
      {isRenderingMermaid && (
        <div className="absolute bottom-4 right-8 z-20 flex items-center gap-2 px-3 py-2 text-xs font-medium text-blue-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-100 dark:border-blue-900/30 rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-2">
            <Loader className="w-3 h-3 animate-spin" />
            <span>Rendering Diagrams...</span>
        </div>
      )}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="absolute bottom-16 right-8 z-20 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 animate-in fade-in zoom-in-95 opacity-80 hover:opacity-100"
          title="Scroll to Top"
        >
          <ArrowUp size={20} />
        </button>
      )}
      <div className="absolute top-4 right-8 z-10 flex gap-2 opacity-0 hover:opacity-100 transition-opacity duration-200">
        <button 
          onClick={handleCopyAll}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
          title="Copy Markdown Source"
        >
          <Copy className="w-3 h-3" /> Copy
        </button>
        <button 
          onClick={() => handleExport('png')}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          <ImageIcon className="w-3 h-3" /> PNG
        </button>
        <button 
          onClick={() => handleExport('jpeg')}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          <Download className="w-3 h-3" /> JPG
        </button>
      </div>
      <div ref={scrollRef} onScroll={handleScroll} className="h-full w-full overflow-y-auto p-8 scroll-smooth">
        <div 
          ref={contentRef}
          className="prose dark:prose-invert max-w-none 
                     prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800
                     prose-img:rounded-lg prose-headings:border-b prose-headings:border-gray-200 dark:prose-headings:border-gray-700 prose-headings:pb-2"
        />
      </div>
    </div>
  );
};

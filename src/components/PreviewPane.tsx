import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { createMarkdownParser } from '../services/markdownService';
import mermaid from 'mermaid';
import plantumlEncoder from 'plantuml-encoder';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';

export const PreviewPane: React.FC = () => {
  const { markdownContent, plugins, isSyncScroll } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const isScrollingFromEditor = useRef(false);

  // Re-create the markdown parser whenever the plugins list changes
  const md = useMemo(() => createMarkdownParser(plugins), [plugins]);

  useEffect(() => {
    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
      });
    } catch (e) {
      console.warn("Mermaid init error:", e);
    }
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      try {
        setError(null);
        // 1. Render Markdown
        contentRef.current.innerHTML = md.render(markdownContent || '');

        // 2. Render Mermaid Diagrams (only if the plugin is enabled and nodes exist)
        const mermaidNodes = contentRef.current.querySelectorAll('.mermaid');
        if (mermaidNodes.length > 0) {
          mermaid.run({
            nodes: mermaidNodes,
          }).catch(err => console.error('Mermaid error:', err));
        }

        // 3. Render PlantUML diagrams
        const plantUMLNodes = contentRef.current.querySelectorAll('div.plantuml');
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
      } catch (e) {
        console.error("Markdown render error:", e);
        setError("Failed to render markdown content.");
      }
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
    if (!isSyncScroll || !scrollRef.current || isScrollingFromEditor.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const maxScroll = scrollHeight - clientHeight;
    const percentage = maxScroll > 0 ? scrollTop / maxScroll : 0;
    
    window.dispatchEvent(new CustomEvent('preview-scroll', { detail: percentage }));
  };

  if (error) {
    return <div className="h-full w-full p-8 text-red-500 bg-white dark:bg-gray-900">{error}</div>;
  }

  return (
    <div ref={scrollRef} onScroll={handleScroll} className="h-full w-full overflow-y-auto bg-white dark:bg-gray-900 p-8">
      <div 
        ref={contentRef}
        className="prose dark:prose-invert max-w-none 
                   prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800
                   prose-img:rounded-lg prose-headings:border-b prose-headings:border-gray-200 dark:prose-headings:border-gray-700 prose-headings:pb-2"
      />
    </div>
  );
};

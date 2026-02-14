import React, { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import md from '../services/markdownService';
import mermaid from 'mermaid';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';

export const PreviewPane: React.FC = () => {
  const { markdownContent } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
    });
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      // 1. Render Markdown
      containerRef.current.innerHTML = md.render(markdownContent);

      // 2. Render Mermaid Diagrams
      // We select all divs with class 'mermaid' that we created in markdownService.ts
      mermaid.run({
        nodes: containerRef.current.querySelectorAll('.mermaid'),
      }).catch(err => console.error('Mermaid error:', err));
    }
  }, [markdownContent]);

  return (
    <div className="h-full w-full overflow-y-auto bg-white dark:bg-gray-900 p-8">
      <div 
        ref={containerRef}
        className="prose dark:prose-invert max-w-none 
                   prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800
                   prose-img:rounded-lg prose-headings:border-b prose-headings:border-gray-200 dark:prose-headings:border-gray-700 prose-headings:pb-2"
      />
    </div>
  );
};
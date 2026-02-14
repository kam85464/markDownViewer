import React, { useMemo, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { createMarkdownParser, slugify } from '../services/markdownService';

export const TableOfContents: React.FC = () => {
  const { markdownContent, showTOC } = useAppStore();
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const headers = useMemo(() => {
    if (!markdownContent) return [];
    
    // Use a lightweight parser instance just for tokens
    const parser = createMarkdownParser([]); 
    const tokens = parser.parse(markdownContent, {});
    
    const tempHeaders = [];
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === 'heading_open') {
        const level = parseInt(tokens[i].tag.slice(1), 10);
        const inlineToken = tokens[i + 1];
        const text = inlineToken ? inlineToken.content : '';
        const slug = slugify(text);
        tempHeaders.push({ level, text, slug });
      }
    }
    
    return tempHeaders.map((header, index) => {
      const nextHeader = tempHeaders[index + 1];
      const hasChildren = nextHeader && nextHeader.level > header.level;
      return { ...header, hasChildren };
    });
  }, [markdownContent]);

  const visibleIndices = useMemo(() => {
    const indices = new Set<number>();
    const stack: { level: number; collapsed: boolean }[] = [];
    
    headers.forEach((header, index) => {
      while (stack.length > 0 && stack[stack.length - 1].level >= header.level) {
        stack.pop();
      }
      
      if (!stack.some(s => s.collapsed)) {
        indices.add(index);
      }
      
      stack.push({ level: header.level, collapsed: collapsed.has(header.slug) });
    });
    
    return indices;
  }, [headers, collapsed]);

  const toggleCollapse = (slug: string) => {
    const newCollapsed = new Set(collapsed);
    if (newCollapsed.has(slug)) newCollapsed.delete(slug);
    else newCollapsed.add(slug);
    setCollapsed(newCollapsed);
  };

  if (!showTOC) return null;

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 h-full overflow-y-auto p-4 hidden md:block">
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
        Table of Contents
      </h3>
      <ul className="space-y-2">
        {headers.map((header, index) => {
          if (!visibleIndices.has(index)) return null;
          return (
          <li key={index} style={{ paddingLeft: `${(header.level - 1) * 12}px` }} className="flex items-center">
            <button 
              onClick={(e) => { e.stopPropagation(); toggleCollapse(header.slug); }}
              className={`p-1 mr-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 ${header.hasChildren ? '' : 'invisible'}`}
            >
              {collapsed.has(header.slug) ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <button onClick={() => handleScroll(header.slug)} className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-left flex-1 truncate transition-colors" title={header.text}>
              {header.text}
            </button>
          </li>
        )})}
      </ul>
    </div>
  );
};
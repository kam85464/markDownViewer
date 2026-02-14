import React, { useMemo, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { createMarkdownParser, slugify } from '../services/markdownService';
import { Search, X } from 'lucide-react';

export const TableOfContents: React.FC = () => {
  const { markdownContent, showTOC } = useAppStore();
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const headers = useMemo(() => {
    if (!markdownContent) return [];
    
    // Use a lightweight parser instance just for tokens
    const parser = createMarkdownParser([]); 
    const tokens = parser.parse(markdownContent, {});
    
    const tempHeaders: { level: number; text: string; slug: string }[] = [];
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

  const displayIndices = useMemo(() => {
    if (!searchQuery) return visibleIndices;

    const lowerQuery = searchQuery.toLowerCase();
    const result = new Set<number>();
    
    headers.forEach((header, index) => {
      if (header.text.toLowerCase().includes(lowerQuery)) {
        result.add(index);
      }
    });

    // Add ancestors to maintain context
    for (let i = headers.length - 1; i >= 0; i--) {
      if (result.has(i)) {
        const currentLevel = headers[i].level;
        for (let j = i - 1; j >= 0; j--) {
          if (headers[j].level < currentLevel) {
            result.add(j);
            break;
          }
        }
      }
    }
    return result;
  }, [searchQuery, headers, visibleIndices]);

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
      <div className="mb-4 relative">
        <Search className="absolute left-2 top-1.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter..."
          className="w-full pl-8 pr-8 py-1 text-sm border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <ul className="space-y-2">
        {headers.map((header, index) => {
          if (!displayIndices.has(index)) return null;
          return (
          <li key={index} style={{ paddingLeft: `${(header.level - 1) * 12}px` }} className="flex items-center">
            <button 
              onClick={(e) => { e.stopPropagation(); toggleCollapse(header.slug); }}
              className={`p-1 mr-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 ${header.hasChildren && !searchQuery ? '' : 'invisible'}`}
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
import React, { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { createMarkdownParser, slugify } from '../services/markdownService';

export const TableOfContents: React.FC = () => {
  const { markdownContent, showTOC } = useAppStore();

  const headers = useMemo(() => {
    if (!markdownContent) return [];
    
    // Use a lightweight parser instance just for tokens
    const parser = createMarkdownParser([]); 
    const tokens = parser.parse(markdownContent, {});
    
    const result = [];
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === 'heading_open') {
        const level = parseInt(tokens[i].tag.slice(1), 10);
        const inlineToken = tokens[i + 1];
        const text = inlineToken ? inlineToken.content : '';
        const slug = slugify(text);
        result.push({ level, text, slug });
      }
    }
    return result;
  }, [markdownContent]);

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
        {headers.map((header, index) => (
          <li key={index} style={{ paddingLeft: `${(header.level - 1) * 12}px` }}>
            <button onClick={() => handleScroll(header.slug)} className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-left w-full truncate transition-colors" title={header.text}>
              {header.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
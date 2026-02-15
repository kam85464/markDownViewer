import React, { memo, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';

// Memoize the Vim status container so React doesn't re-render it and wipe monaco-vim's content
const VimStatus = memo(() => <div id="vim-status" className="mr-4 font-mono px-2 font-bold text-blue-600 dark:text-blue-400 min-w-[100px]" />, () => true);

export const StatusBar: React.FC = () => {
  const { currentFile, cursorPosition, isVimMode, markdownContent, wordCountGoal } = useAppStore();

  const { wordCount, readingTime } = useMemo(() => {
    const text = markdownContent || '';
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const count = words.length;
    const time = Math.ceil(count / 200);
    return { wordCount: count, readingTime: time };
  }, [markdownContent]);

  const progress = wordCountGoal > 0 ? Math.min(100, Math.round((wordCount / wordCountGoal) * 100)) : 0;

  return (
    <div className="h-6 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center px-4 text-xs text-gray-600 dark:text-gray-400 select-none">
      <div className="flex-1 truncate">
        {currentFile ? currentFile.path : ''}
      </div>
      <div className="flex items-center">
        {isVimMode && <VimStatus />}
        {wordCountGoal > 0 && (
           <div className="mx-3 flex items-center gap-2" title={`Goal: ${wordCountGoal} words`}>
             <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
               <div 
                 className={`h-full transition-all duration-500 ${progress >= 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                 style={{ width: `${progress}%` }}
               />
             </div>
             <span>{progress}%</span>
           </div>
        )}
        <div className="mx-3">{wordCount} words</div>
        <div className="mx-3">{readingTime} min read</div>
        <div className="ml-3 pl-3 border-l border-gray-300 dark:border-gray-600">
          Ln {cursorPosition.line}, Col {cursorPosition.column}
        </div>
      </div>
    </div>
  );
};
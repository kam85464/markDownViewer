import React, { useRef, useEffect } from 'react';
import MonacoEditor, { OnMount, BeforeMount } from '@monaco-editor/react';
import { useAppStore } from '../store/useAppStore';
import { dracula, nord } from '../utils/themes';

export const EditorPane: React.FC = () => {
  const { markdownContent, setMarkdownContent, theme, setCursorPosition, findTrigger, isVimMode, isTypewriterMode, isSyncScroll, showMinimap, showLineNumbers, wordWrap, customCSS, isFocusMode, setIsTyping, fontSize, files, selectFile, currentFile } = useAppStore();
  const editorRef = useRef<any>(null);
  const vimModeRef = useRef<any>(null);
  const isTypewriterModeRef = useRef(isTypewriterMode);
  const isSyncScrollRef = useRef(isSyncScroll);
  const isScrollingFromPreview = useRef(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const definitionProviderRef = useRef<any>(null);
  const filesRef = useRef(files);
  const currentFileRef = useRef(currentFile);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    currentFileRef.current = currentFile;
  }, [currentFile]);

  useEffect(() => {
    return () => {
      if (definitionProviderRef.current) {
        definitionProviderRef.current.dispose();
      }
    };
  }, []);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.onDidChangeCursorPosition((e) => {
      setCursorPosition(e.position.lineNumber, e.position.column);
      if (isTypewriterModeRef.current) {
        editor.revealLineInCenter(e.position.lineNumber);
      }
    });
    editor.onDidScrollChange((e) => {
      if (isSyncScrollRef.current && !isScrollingFromPreview.current) {
        const layoutInfo = editor.getLayoutInfo();
        const maxScroll = e.scrollHeight - layoutInfo.height;
        const percentage = maxScroll > 0 ? e.scrollTop / maxScroll : 0;
        window.dispatchEvent(new CustomEvent('editor-scroll', { detail: percentage }));
      }
    });

    if (definitionProviderRef.current) {
      definitionProviderRef.current.dispose();
    }
    // @ts-ignore
    definitionProviderRef.current = monaco.languages.registerDefinitionProvider('markdown', {
      provideDefinition: (model: any, position: any) => {
        const lineContent = model.getLineContent(position.lineNumber);
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match;
        
        while ((match = linkRegex.exec(lineContent)) !== null) {
          const start = match.index;
          const end = start + match[0].length;
          const urlStart = start + match[0].indexOf('(') + 1;
          const urlEnd = end - 1;

          if (position.column >= urlStart + 1 && position.column <= urlEnd + 1) {
             const linkPath = match[2];
             if (!filesRef.current || !currentFileRef.current) return null;

             let targetPath = linkPath;
             // Basic relative path resolution
             if (!linkPath.startsWith('/') && !linkPath.startsWith('http') && !linkPath.includes(':')) {
                const currentDir = currentFileRef.current.path.substring(0, currentFileRef.current.path.lastIndexOf('/'));
                // Handle ../
                const parts = currentDir.split('/');
                const relParts = linkPath.split('/');
                while (relParts[0] === '..' && parts.length > 0) {
                    parts.pop();
                    relParts.shift();
                }
                if (relParts[0] === '.') relParts.shift();
                targetPath = [...parts, ...relParts].join('/');
             }

             const targetFile = filesRef.current.find((f: any) => f.path === targetPath || f.path.endsWith(linkPath));

             if (targetFile) {
               selectFile(targetFile);
               return null;
             }
          }
        }
        return null;
      }
    });
  };

  const handleBeforeMount: BeforeMount = (monaco) => {
    monaco.editor.defineTheme('dracula', dracula as any);
    monaco.editor.defineTheme('nord', nord as any);
  };

  useEffect(() => {
    if (findTrigger > 0 && editorRef.current) {
      editorRef.current.trigger('source', 'actions.find');
    }
  }, [findTrigger]);

  useEffect(() => {
    if (!editorRef.current) return;
    let canceled = false;

    // Small delay to ensure the DOM is ready if switching from Zen Mode
    if (isVimMode) {
      const statusNode = document.getElementById('vim-status');
      if (statusNode) {
        import('monaco-vim').then(({ initVimMode }) => {
          if (!canceled && editorRef.current) {
            vimModeRef.current = initVimMode(editorRef.current, statusNode);
          }
        });
      }
    } else {
      if (vimModeRef.current) {
        vimModeRef.current.dispose();
        vimModeRef.current = null;
      }
    }

    return () => {
      canceled = true;
      if (vimModeRef.current) {
        vimModeRef.current.dispose();
        vimModeRef.current = null;
      }
    };
  }, [isVimMode]);

  useEffect(() => {
    isTypewriterModeRef.current = isTypewriterMode;
    if (isTypewriterMode && editorRef.current) {
      editorRef.current.updateOptions({ 
        scrollBeyondLastLine: true,
        padding: { top: 16, bottom: 16 }
      });
      const position = editorRef.current.getPosition();
      if (position) {
        editorRef.current.revealLineInCenter(position.lineNumber);
      }
    } else if (!isTypewriterMode && editorRef.current) {
      editorRef.current.updateOptions({ scrollBeyondLastLine: false, padding: { top: 16, bottom: 16 } });
    }
  }, [isTypewriterMode]);

  useEffect(() => {
    isSyncScrollRef.current = isSyncScroll;
  }, [isSyncScroll]);

  useEffect(() => {
    const handlePreviewScroll = (e: Event) => {
      if (!isSyncScroll || !editorRef.current) return;
      
      isScrollingFromPreview.current = true;
      const customEvent = e as CustomEvent;
      const percentage = customEvent.detail;
      
      const scrollHeight = editorRef.current.getScrollHeight();
      const layoutInfo = editorRef.current.getLayoutInfo();
      const maxScroll = scrollHeight - layoutInfo.height;
      
      editorRef.current.setScrollTop(percentage * maxScroll);
      setTimeout(() => { isScrollingFromPreview.current = false; }, 50);
    };

    window.addEventListener('preview-scroll', handlePreviewScroll);
    return () => window.removeEventListener('preview-scroll', handlePreviewScroll);
  }, [isSyncScroll]);

  const handleEditorChange = (value: string | undefined) => {
    setMarkdownContent(value || '');
    if (isFocusMode) {
      setIsTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    }
  };

  return (
    <div className="h-full w-full overflow-hidden">
      {customCSS && <style>{customCSS}</style>}
      <MonacoEditor
        height="100%"
        language="markdown"
        theme={theme}
        value={markdownContent}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        beforeMount={handleBeforeMount}
        options={{
          minimap: { enabled: showMinimap },
          lineNumbers: showLineNumbers ? 'on' : 'off',
          wordWrap: wordWrap ? 'on' : 'off',
          fontSize: fontSize || 14,
          scrollBeyondLastLine: isTypewriterMode, // Dynamic option
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          smoothScrolling: true,
          cursorSmoothCaretAnimation: "on",
        }}
      />
    </div>
  );
};

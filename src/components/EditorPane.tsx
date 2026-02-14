import React, { useRef, useEffect } from 'react';
import MonacoEditor, { OnMount, BeforeMount } from '@monaco-editor/react';
import { useAppStore } from '../store/useAppStore';
import { dracula, nord } from '../utils/themes';
import { initVimMode } from 'monaco-vim';

export const EditorPane: React.FC = () => {
  const { markdownContent, setMarkdownContent, theme, setCursorPosition, findTrigger, isVimMode, isTypewriterMode, isSyncScroll, showMinimap, wordWrap, customCSS } = useAppStore();
  const editorRef = useRef<any>(null);
  const vimModeRef = useRef<any>(null);
  const isTypewriterModeRef = useRef(isTypewriterMode);
  const isSyncScrollRef = useRef(isSyncScroll);
  const isScrollingFromPreview = useRef(false);

  const handleEditorDidMount: OnMount = (editor) => {
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

    // Small delay to ensure the DOM is ready if switching from Zen Mode
    if (isVimMode) {
      const statusNode = document.getElementById('vim-status');
      if (statusNode) {
        vimModeRef.current = initVimMode(editorRef.current, statusNode);
      }
    } else {
      if (vimModeRef.current) {
        vimModeRef.current.dispose();
        vimModeRef.current = null;
      }
    }

    return () => {
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

  return (
    <div className="h-full w-full overflow-hidden">
      {customCSS && <style>{customCSS}</style>}
      <MonacoEditor
        height="100%"
        language="markdown"
        theme={theme}
        value={markdownContent}
        onChange={(value) => setMarkdownContent(value || '')}
        onMount={handleEditorDidMount}
        beforeMount={handleBeforeMount}
        options={{
          minimap: { enabled: showMinimap },
          wordWrap: wordWrap ? 'on' : 'off',
          fontSize: 14,
          scrollBeyondLastLine: isTypewriterMode, // Dynamic option
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  );
};

import React, { useRef, useEffect } from 'react';
import MonacoEditor, { OnMount, BeforeMount } from '@monaco-editor/react';
import { useAppStore } from '../store/useAppStore';
import { dracula, nord } from '../utils/themes';
import { initVimMode } from 'monaco-vim';

export const EditorPane: React.FC = () => {
  const { markdownContent, setMarkdownContent, theme, setCursorPosition, findTrigger, isVimMode, isZenMode, isDistractionFreeMode, isTypewriterMode } = useAppStore();
  const editorRef = useRef<any>(null);
  const vimModeRef = useRef<any>(null);
  const isTypewriterModeRef = useRef(isTypewriterMode);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.onDidChangeCursorPosition((e) => {
      setCursorPosition(e.position.lineNumber, e.position.column);
      if (isTypewriterModeRef.current) {
        editor.revealLineInCenter(e.position.lineNumber);
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
    if (isVimMode && !isZenMode && !isDistractionFreeMode) {
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
  }, [isVimMode, isZenMode, isDistractionFreeMode]);

  useEffect(() => {
    isTypewriterModeRef.current = isTypewriterMode;
    if (isTypewriterMode && editorRef.current) {
      const position = editorRef.current.getPosition();
      if (position) {
        editorRef.current.revealLineInCenter(position.lineNumber);
      }
    }
  }, [isTypewriterMode]);

  return (
    <div className="h-full w-full overflow-hidden">
      <MonacoEditor
        height="100%"
        language="markdown"
        theme={theme}
        value={markdownContent}
        onChange={(value) => setMarkdownContent(value || '')}
        onMount={handleEditorDidMount}
        beforeMount={handleBeforeMount}
        options={{
          minimap: { enabled: false },
          wordWrap: 'on',
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  );
};
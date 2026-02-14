import React from 'react';
import MonacoEditor, { OnMount } from '@monaco-editor/react';
import { useAppStore } from '../store/useAppStore';

export const EditorPane: React.FC = () => {
  const { markdownContent, setMarkdownContent, isDarkMode, setCursorPosition } = useAppStore();

  const handleEditorDidMount: OnMount = (editor) => {
    editor.onDidChangeCursorPosition((e) => {
      setCursorPosition(e.position.lineNumber, e.position.column);
    });
  };

  return (
    <div className="h-full w-full overflow-hidden">
      <MonacoEditor
        height="100%"
        language="markdown"
        theme={isDarkMode ? "vs-dark" : "light"}
        value={markdownContent}
        onChange={(value) => setMarkdownContent(value || '')}
        onMount={handleEditorDidMount}
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
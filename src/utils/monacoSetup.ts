import { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

export const setupMonaco = () => {
  // Configure the loader to use the locally installed monaco-editor
  // This prevents downloading it from a CDN and ensures PWA offline support works
  loader.config({ monaco });

  loader.init().then((monacoInstance) => {
    // 1. Define GitHub Dark Theme
    monacoInstance.editor.defineTheme('github-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '8b949e' },
        { token: 'keyword', foreground: 'ff7b72' },
        { token: 'string', foreground: 'a5d6ff' },
        { token: 'variable', foreground: '79c0ff' },
        { token: 'type', foreground: '79c0ff' },
        { token: 'function', foreground: 'd2a8ff' },
        { token: 'number', foreground: '79c0ff' },
        { token: 'identifier', foreground: 'c9d1d9' },
        { token: 'class', foreground: 'f0883e' },
        { token: 'delimiter', foreground: 'c9d1d9' },
      ],
      colors: {
        'editor.background': '#0d1117',
        'editor.foreground': '#c9d1d9',
        'editorCursor.foreground': '#c9d1d9',
        'editor.lineHighlightBackground': '#161b22',
        'editorLineNumber.foreground': '#6e7681',
        'editor.selectionBackground': '#1f6feb55',
        'editor.inactiveSelectionBackground': '#1f6feb22',
      },
    });

    // 2. Register a Custom Language (Example: 'mylang')
    monacoInstance.languages.register({ id: 'mylang' });

    // Define the syntax highlighting for the custom language
    monacoInstance.languages.setMonarchTokensProvider('mylang', {
      tokenizer: {
        root: [
          // Example rules:
          [/\[error.*/, 'custom-error'],
          [/\[notice.*/, 'custom-notice'],
          [/\[info.*/, 'custom-info'],
          [/\[[a-zA-Z 0-9:]+\]/, 'custom-date'],
          [/"[^"]*"/, 'string'],
        ],
      },
    });
  });
};
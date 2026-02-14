# Markdown Viewer Pro

A powerful, cross-platform Markdown viewer and editor built with React, Electron, and TypeScript.

## Features

### Core Functionality

- **Cross-Platform:** Runs smoothly on macOS, Windows, and Linux.
- **Folder Workspace:** Open local folders and recursively scan for Markdown files.
- **File Explorer:** Sidebar navigation with file search filtering.
- **Recent Folders:** Quickly access previously opened workspaces.

### Editing & Preview

- **Split View:** Toggle between read-only preview and split editor/preview mode.
- **Monaco Editor:** High-performance code editor with syntax highlighting.
- **Real-time Preview:** Instant rendering of Markdown changes.
- **Status Bar:** Displays current file path and cursor position (Line/Column).
- **Find & Replace:** Search functionality within the editor content.
- **Vim Mode:** Optional Vim keybindings for the editor.
- **Zen Mode:** Distraction-free writing mode hiding sidebar and status bar.

### Advanced Markdown Support

- **Diagrams:** Support for Mermaid and PlantUML diagrams.
- **Math:** LaTeX equation rendering via KaTeX.
- **Code Highlighting:** Syntax highlighting for code blocks using Highlight.js.
- **Task Lists:** Interactive GFM-style task lists.
- **Presentation Mode:** Render markdown as a slideshow using reveal.js (split slides with `---`).

### File Operations

- **File Management:** Read and save Markdown files directly to disk.
- **PDF Export:** Export rendered Markdown to PDF documents.
- **HTML Export:** Export rendered Markdown to HTML files.
- **Safety:** Confirmation dialogs for unsaved changes before closing folders.
- **Save As:** Ability to save files with a new name.

### UI/UX

- **Dark Mode:** Built-in dark theme support.
- **Responsive Layout:** Adjustable panes and clean interface.
- **Tabs:** Support for opening multiple files simultaneously.
- **Custom Themes:** User-configurable editor themes (Dracula, Nord, etc.).
- **Plugin System:** Basic plugin manager interface.

## Roadmap

- [ ] **Git Integration:** Basic git status and commit features.
- [ ] **Cloud Sync:** Sync with Google Drive / Dropbox.

## Development

### Setup

`npm install`

### Run

`npm run dev`

# Markdown Viewer Pro - Development Plan

## Project Overview
A powerful Markdown viewer built with Electron, React, TypeScript, and Vite. Provides rich editing, preview, and presentation capabilities with extensive plugin support.

## Current Status: ✅ BUILD COMPLETE & VALIDATED

### Completed Phase: Codebase Review & Bug Fixes
- **IPC Channel Alignment**: Fixed all Electron IPC channel names in fileService to match main.ts handlers
  - `dialog:openFolder` → `select-folder`
  - `fs:scanFolder` → `scan-folder`
  - `fs:readFile` → `read-file`
  - `fs:saveFile` → `save-file`
  - `export:pdf` → `export-pdf`
  - `export:html` → `export-html`

- **Vite Configuration**: Removed invalid esbuildOptions that caused build failures
  - Removed function definitions from define object
  - Removed incompatible CJS format with code splitting
  - Cleaned up problematic prettier plugin dependencies

- **Build Validation**:
  - ✅ TypeScript compilation: 0 errors
  - ✅ Vite client build: 373 chunks, ~5.9MB (5.6MB gzipped)
  - ✅ Electron main process: 290KB (90KB gzipped)
  - ✅ Dev server: Launches successfully on port 5174
  - ✅ Production build: DMG & ZIP artifacts generated

---

## Next Phases (Recommended)

### Phase 1: Testing & QA
- [ ] Unit tests for core services (fileService, markdownService, settingsService)
- [ ] Integration tests for Electron IPC communication
- [ ] E2E tests for main workflows (open file, edit, save, export)
- [ ] Cross-platform testing (macOS, Windows, Linux)
- [ ] Manual testing of all features:
  - File operations (open, save, save-as)
  - Markdown rendering with plugins (Mermaid, KaTeX, PlantUML)
  - Editor features (Vim mode, typewriter mode, sync scroll)
  - Export functionality (PDF, HTML, PNG, JPEG)
  - Settings persistence
  - Recent files tracking

### Phase 2: UI/UX Enhancements
- [ ] Polish error handling and user feedback
- [ ] Add loading states for file operations
- [ ] Improve accessibility (keyboard navigation, screen readers)
- [ ] Add drag-and-drop file support
- [ ] Implement file history/undo functionality
- [ ] Add search and replace in editor

### Phase 3: Performance Optimization
- [ ] Code-split large chunks (Monaco editor, Mermaid, KaTeX)
- [ ] Lazy load plugins on demand
- [ ] Optimize bundle size warning (current: 5.9MB)
- [ ] Implement virtual scrolling for large documents
- [ ] Add file caching strategies

### Phase 4: Feature Enhancements
- [ ] Custom theme creation and export
- [ ] Plugin marketplace/store
- [ ] Collaborative editing (if needed)
- [ ] Cloud sync support
- [ ] Advanced search with regex
- [ ] Custom keyboard shortcuts management
- [ ] Template system for new documents

### Phase 5: Deployment & Distribution
- [ ] Code signing for macOS/Windows builds
- [ ] Auto-update mechanism setup
- [ ] Release notes generation
- [ ] Documentation website
- [ ] GitHub Actions CI/CD pipeline
- [ ] Release to app stores (if applicable)

---

## Architecture Overview

### Core Structure
```
markDownViewer/
├── electron/           # Electron main & preload processes
├── src/
│   ├── components/     # React components
│   ├── services/       # Business logic (file, markdown, settings)
│   ├── store/          # Zustand state management
│   ├── types/          # TypeScript definitions
│   ├── utils/          # Utilities (themes, helpers)
│   └── styles/         # Theme CSS files
├── dist/              # Built app
└── dist-electron/     # Built Electron processes
```

### Key Technologies
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Editor**: Monaco Editor, Monaco-Vim
- **Rendering**: Markdown-it with plugins (KaTeX, Highlightjs, Task Lists)
- **Diagrams**: Mermaid, PlantUML
- **Math**: KaTeX
- **State**: Zustand
- **Build**: Vite, Electron-Builder
- **Desktop**: Electron 32

### Available Features
1. **File Management**: Open folders, scan markdown files, recent files
2. **Editing**: Split view, Zen mode, Distraction-free mode
3. **Visualization**: Live preview with sync scroll, Table of Contents
4. **Plugins**: Mermaid, KaTeX, PlantUML, Task Lists, Highlight.js
5. **Modes**: Presentation mode, Typewriter mode, Vim mode
6. **Theming**: 10+ built-in themes with custom CSS support
7. **Export**: PDF, HTML, PNG, JPEG
8. **Settings**: Persistent configuration, auto-save

---

## Known Issues & Limitations
- Large chunks in bundle (5.9MB) - needs code splitting optimization
- No code signing certificates configured for production builds
- PlantUML requires network access (uses plantuml.com service)
- Some themes may need refinement for dark mode

---

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Notes for Further Development
- All IPC channels are now properly aligned between preload and main process
- FileService handles both Electron and Browser (fallback) modes
- Settings are persisted using electron-store
- Error boundaries are in place for component-level error handling
- CSS files use utility classes from Tailwind for consistency

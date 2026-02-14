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
- [x] **Export Options:** Support for PNG/JPEG export of rendered content.
- [x] **Custom CSS:** Allow users to provide their own stylesheet for the preview.
- [ ] **Auto-Save:** Configurable auto-save interval.

## Development
updated
### Setup

`npm install`

### Run

`npm run dev`

### Build

`npm run build`

Markdown  provides many useful features:
### Markdown Editor

* Syntax highlighted Markdown editing
* Live and synced HTML preview
* Gentle, optional toolbar support for Markdown newbies
* Inline spell checking
* Line and Word counts
* Synced Document Outline
* Distraction free mode
* Markdown folding
* Split view
### Previewer

* Scroll synced preview window
* Optional external previewer for multi-screen
* Preview in Web Browser
* Presentation mode support
* Distraction-free mode support
* Document Navigation from embedded Markdown Links
### Image Features

* Paste images from Clipboard
* Smartly select and embed images from disk or URL
* Drag images from Folder Browser
* Drag images from Explorer
* Edit images in your image editor of choice
* Built-in screen capture
* Automatic image compression on pasted images
### Editing Features

* Easy link embedding from clipboard or disk
* Embed code snippets and see highlighted syntax coloring
* Two-way table editor for interactively creating and editing tables
* Text Snippet Expansion with C# Code via Snippets Addin
* Embed Emojii
* Smart, unobtrusive toolbar and shortcut key helpers
* Snippet expansion from text templates
* Document Outline to navigate large documents
* Link Checker lets you check images and links for validity
* Many Editor customization options
### Output and Selections

* Save rendered output to self-contained HTML or HTML Fragment
* Save rendered output to PDF
* Copy Markdown selection as HTML
* Paste HTML text as Markdown
* Open rendered output in your favorite Web browser
* Print rendered output to the printer or PDF driver
* Generate and embed document Table of Contents
### Theme Support

* Dark and Light application themes
* Customizable Editor Themes
* Customizable Preview Themes
* Customizable output syntax coloring themes
* Each type of theme can be individually applied
* Use HTML and CSS to customize Preview and Editor Themes
### File Operations

* Editor remembers open documents by default (optional)
* Auto-Save and Auto-Backup support
* Many file operations on each file
    * Shell Viewer
    * Open With...
    * Edit in appropriate editors
    * View/Edit Images in configured apps
    * Compress images
    * Commit to Git
    * Open on Github (if Github repo)
* Save files with encryption
* Drag and drop documents from Explorer and Folder Browser
* Open a Terminal, Explorer or Git Client
### Organization and File Access

* Integrated File and Folder browser
* Quick File Search
* Find in Files (search files and content)
* Favorites Sidebar - save, organize and search
* Group files into Projects
* Drag and Drop files everywhere
### Git Integration

* Show Git Status in Folder Browser
* Commit and push Dialog
* Commit and push active file, folder browser file
* Commit and push all pending changes
* Compare changes in configured Git Diff client
* Undo Changes
* Add Ignored Files
* Clone Repository
* Open in Git Client
### AI Support

* Support for any OpenAI based API local or remote requires your own API keys
* AI Image Generation
* AI Document and Selection Summaries
* AI Translation
* AI Grammar Check
### Weblog Publishing

* Create or edit Weblog posts using Markdown
* Publish your Markdown directly to your blog
* Re-publish posts at any time
* Post data stored as YAML metadata in Markdown
* Send custom meta data with posts
* Supports MetaWebLog, Wordpress and Medium (limited)
* Supports document based blogs (Jekyll, Hugo, Wyam, Ghost etc.)
* Download and edit existing posts
* Very fast publish and download process
* Support for multiple blogs
* Dropbox and OneDrive shared post storage

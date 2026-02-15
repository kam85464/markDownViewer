import * as monaco from 'monaco-editor';

export class GitIntegration {
    constructor(editor) {
        this.editor = editor;
        // Ensure we have enough lanes for git decorations + existing ones (Edit/Preview)
        this.editor.updateOptions({ glyphMarginDecorationLaneCount: 2 });
        this.decorations = editor.createDecorationsCollection();
        this.mouseDownListener = this.editor.onMouseDown((e) => this._onMouseDown(e));
    }

    dispose() {
        this.mouseDownListener.dispose();
        this.decorations.clear();
    }

    _onMouseDown(e) {
        if (e.target.type === monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN) {
            const lineNumber = e.target.position.lineNumber;
            const lineDecorations = this.editor.getLineDecorations(lineNumber);
            
            for (const decoration of lineDecorations) {
                const className = decoration.options.glyphMarginClassName;
                if (className) {
                    console.log('Glyph clicked:', className, 'on line:', lineNumber);
                    // TODO: Add logic here to handle clicks (e.g., show diff, stage file, etc.)
                }
            }
        }
    }

    updateDecorations(diffs) {
        const newDecorations = [];
        
        diffs.forEach(diff => {
            if (diff.type === 'added') {
                newDecorations.push({
                    range: new monaco.Range(diff.startLine, 1, diff.endLine, 1),
                    options: {
                        isWholeLine: true,
                        linesDecorationsClassName: 'git-added-line-decoration',
                        glyphMarginClassName: 'codicon codicon-add git-added-glyph',
                        glyphMargin: { position: 2 },
                        zIndex: 10
                    }
                });
            } else if (diff.type === 'modified') {
                newDecorations.push({
                    range: new monaco.Range(diff.startLine, 1, diff.endLine, 1),
                    options: {
                        isWholeLine: true,
                        linesDecorationsClassName: 'git-modified-line-decoration',
                        glyphMarginClassName: 'codicon codicon-diff-modified git-modified-glyph',
                        glyphMargin: { position: 2 },
                        zIndex: 10
                    }
                });
            } else if (diff.type === 'deleted') {
                 newDecorations.push({
                    range: new monaco.Range(diff.line, 1, diff.line, 1),
                    options: {
                        isWholeLine: true,
                        glyphMarginClassName: 'codicon codicon-diff-removed git-deleted-glyph',
                        glyphMargin: { position: 2 },
                        zIndex: 10
                    }
                });
            }
        });

        this.decorations.set(newDecorations);
    }
}
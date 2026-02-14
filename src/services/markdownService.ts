import MarkdownIt from 'markdown-it';
// @ts-ignore
import mk from 'markdown-it-katex';
import hljs from 'markdown-it-highlightjs';
import { Plugin } from '../types/plugin';
import { format } from 'prettier/standalone';
// @ts-ignore
import taskLists from 'markdown-it-task-lists';
import * as prettierPluginMarkdown from 'prettier/plugins/markdown';
import * as prettierPluginEstree from 'prettier/plugins/estree';

// Helper to safely load plugins
const safeUse = (md: MarkdownIt, plugin: any, options?: any) => {
  try {
    if (typeof plugin === 'function') {
      md.use(plugin, options);
    } else if (plugin && typeof plugin.default === 'function') {
      md.use(plugin.default, options);
    } else {
      console.warn('Markdown plugin not loaded (invalid type):', plugin);
    }
  } catch (e) {
    console.error('Failed to load markdown plugin:', e);
  }
};

export const slugify = (text: string) => text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '');

export const formatMarkdown = async (content: string) => {
  return await format(content, {
    parser: 'markdown',
    plugins: [prettierPluginMarkdown, prettierPluginEstree],
  });
};

// Factory function to create a configured parser
export const createMarkdownParser = (enabledPlugins: Plugin[] = []) => {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  });

  // Always use highlight.js and task lists as core features
  safeUse(md, hljs);

  // Wrap the highlighter to prevent errors with unknown languages (like plantuml)
  const originalHighlight = md.options.highlight;
  md.options.highlight = (str, lang, attrs) => {
    if (lang === 'plantuml') {
      return md.utils.escapeHtml(str);
    }
    try {
      if (originalHighlight) {
        return originalHighlight(str, lang, attrs);
      }
    } catch (e) {
      console.warn(`Failed to highlight language: ${lang}`, e);
    }
    return ''; // Fallback to default escaping
  };

  safeUse(md, taskLists);

  // Custom rule to add IDs to headings for TOC navigation
  md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const inlineToken = tokens[idx + 1];
    const title = inlineToken ? inlineToken.content : '';
    const slug = slugify(title);
    token.attrSet('id', slug);
    return self.renderToken(tokens, idx, options);
  };

  // Conditionally enable other plugins based on the store state
  // We check if the plugin ID exists in the enabled list
  const isEnabled = (id: string) => enabledPlugins.some(p => p.id === id && p.enabled);

  if (isEnabled('katex')) {
    safeUse(md, mk);
  }

  if (isEnabled('mermaid')) {
    // Mermaid is handled client-side in PreviewPane, but we need the fence rule
    // This rule is added below regardless, but we could toggle it here if we wanted strict control
  }

  // Custom rule to wrap mermaid code blocks in a div that mermaid.js can find
  const defaultFence = md.renderer.rules.fence || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const info = token.info.trim();
    
    if (info === 'mermaid') {
      // Only render mermaid div if enabled, otherwise render code block
      if (isEnabled('mermaid')) {
        return `<div class="mermaid">${token.content}</div>`;
      }
    }
    
    if (info === 'plantuml') {
      if (isEnabled('plantuml')) {
        return `<div class="plantuml">${token.content}</div>`;
      }
    }
    
    return defaultFence(tokens, idx, options, env, self);
  };

  return md;
};

// Default instance for initial load or static usage
const defaultMd = createMarkdownParser([
  { id: 'mermaid', name: '', description: '', version: '', author: '', enabled: true },
  { id: 'katex', name: '', description: '', version: '', author: '', enabled: true }
]);

export default defaultMd;

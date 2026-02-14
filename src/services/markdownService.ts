import MarkdownIt from 'markdown-it';
import mk from 'markdown-it-katex';
import hljs from 'markdown-it-highlightjs';
import taskLists from 'markdown-it-task-lists';
import plantuml from 'markdown-it-plantuml';

// Mermaid is handled via client-side rendering in the Preview component
// because markdown-it-mermaid often conflicts with React/Vite build processes.
// We will render a div with class 'mermaid' and let mermaid.js pick it up.

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

md.use(mk);
md.use(hljs);
md.use(taskLists);
md.use(plantuml, {
  openMarker: '@startuml',
  closeMarker: '@enduml',
});

// Custom rule to wrap mermaid code blocks in a div that mermaid.js can find
const defaultFence = md.renderer.rules.fence || function(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const info = token.info.trim();
  
  if (info === 'mermaid') {
    return `<div class="mermaid">${token.content}</div>`;
  }
  
  return defaultFence(tokens, idx, options, env, self);
};

export default md;
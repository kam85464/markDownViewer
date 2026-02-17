import React, { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { useAppStore } from './store/useAppStore';
import OfflineBanner from './OfflineBanner';
import { setupMonaco } from './utils/monacoSetup';
import { TemplateModal } from './components/TemplateModal';
import { saveCustomTemplate } from './utils/templates';

setupMonaco();

const App: React.FC = () => {
  const { isDarkMode, edgeStyle, markdownContent, setMarkdownContent, selectFile } = useAppStore();
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#1e293b');
    } else {
      root.classList.remove('dark');
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#ffffff');
    }
    root.classList.remove('sharp', 'rounded', 'curved');
    root.classList.add(edgeStyle);

  }, [isDarkMode, edgeStyle]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 's') {
        e.preventDefault();
        handleSaveAsTemplate();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveAsTemplate = () => {
    const name = window.prompt('Enter a name for your new template:');
    if (name) {
      const description = window.prompt('Enter a short description (optional):') || '';
      const category = window.prompt('Enter a category (optional):') || 'Custom';
      saveCustomTemplate({
        id: Date.now().toString(),
        name,
        description,
        category,
        content: markdownContent,
      });
      alert('Template saved successfully!');
    }
  };

  const handleTemplateSelect = async (content: string) => {
    if (markdownContent && markdownContent.trim() !== '' && !confirm('This will overwrite your current document. Continue?')) {
      return;
    }
    await selectFile({ name: 'Untitled', path: '', parent: '' });
    setMarkdownContent(content);
    setIsTemplateModalOpen(false);
  };

  return (
    <>
      <OfflineBanner />
      <Layout 
        onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
        onSaveTemplate={handleSaveAsTemplate}
      />
      <TemplateModal 
        isOpen={isTemplateModalOpen} 
        onClose={() => {
          setIsTemplateModalOpen(false);
        }} 
        onSelect={handleTemplateSelect} 
      />
    </>
  );
};

export default App;
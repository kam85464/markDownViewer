import React, { useEffect, useState } from 'react';
import { TemplateGallery } from './TemplateGallery';
import { getAllTemplates, deleteCustomTemplate, Template, getRecentTemplates, addToRecentTemplates, getFavoriteTemplates, getFavoriteIds, toggleFavoriteTemplate } from '../utils/templates';
import { X, Search, Clock, Star, LayoutGrid, ArrowLeft, Check } from 'lucide-react';
import { clsx } from 'clsx';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (content: string) => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [recentTemplates, setRecentTemplates] = useState<Template[]>([]);
  const [favoriteTemplates, setFavoriteTemplates] = useState<Template[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTemplates(getAllTemplates());
      setRecentTemplates(getRecentTemplates());
      setFavoriteTemplates(getFavoriteTemplates());
      setFavoriteIds(getFavoriteIds());
      setSearchQuery('');
      setSelectedCategory('All');
      setPreviewTemplate(null);
    }
  }, [isOpen]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      deleteCustomTemplate(id);
      setTemplates(getAllTemplates());
    }
  };

  const handleTemplateClick = (template: Template) => {
    setPreviewTemplate(template);
  };

  const handleConfirmSelect = () => {
    if (previewTemplate) {
      addToRecentTemplates(previewTemplate.id);
      onSelect(previewTemplate.content);
    }
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavoriteTemplate(id);
    setFavoriteTemplates(getFavoriteTemplates());
    setFavoriteIds(getFavoriteIds());
  };

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category || 'Uncategorized')))];

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || (t.category || 'Uncategorized') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col border border-slate-200 dark:border-slate-700 overflow-hidden">
        {previewTemplate ? (
          <div className="flex flex-col h-full animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Back to Gallery"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    {React.createElement(previewTemplate.icon, { className: "w-5 h-5" })}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{previewTemplate.name}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{previewTemplate.category || 'General'}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-slate-950">
              <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider">Description</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{previewTemplate.description}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider">Content Preview</h3>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-6 font-mono text-sm whitespace-pre-wrap text-slate-800 dark:text-slate-300 shadow-sm overflow-x-auto">
                    {previewTemplate.content}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex justify-end gap-3">
              <button onClick={() => setPreviewTemplate(null)} className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors">Back</button>
              <button onClick={handleConfirmSelect} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"><Check className="w-4 h-4" />Use Template</button>
            </div>
          </div>
        ) : (
        <>
        <div className="flex flex-col gap-6 p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Choose a Template</h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-500 outline-none"
              autoFocus
            />
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-4 overflow-y-auto">
            <div className="flex flex-col gap-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left",
                    selectedCategory === category
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  {category === 'All' ? <LayoutGrid className="w-4 h-4" /> : null}
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-slate-950">
            {searchQuery === '' && selectedCategory === 'All' && favoriteTemplates.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <Star className="w-4 h-4" />
                  Favorites
                </div>
                <TemplateGallery 
                  templates={favoriteTemplates} 
                  onSelect={handleTemplateClick}
                  favoriteIds={favoriteIds}
                  onToggleFavorite={handleToggleFavorite}
                />
              </div>
            )}

            {searchQuery === '' && selectedCategory === 'All' && recentTemplates.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <Clock className="w-4 h-4" />
                  Recently Used
                </div>
                <TemplateGallery 
                  templates={recentTemplates} 
                  onSelect={handleTemplateClick} 
                  favoriteIds={favoriteIds}
                  onToggleFavorite={handleToggleFavorite}
                />
              </div>
            )}

            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {selectedCategory === 'All' ? 'All Templates' : selectedCategory}
            </div>
            <TemplateGallery 
              templates={filteredTemplates} 
              onSelect={handleTemplateClick} 
              onDelete={handleDelete} 
              favoriteIds={favoriteIds}
              onToggleFavorite={handleToggleFavorite}
            />
            {filteredTemplates.length === 0 && (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                No templates found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
};
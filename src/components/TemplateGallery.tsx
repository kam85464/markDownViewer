import React from 'react';
import { Template } from '../utils/templates';
import { clsx } from 'clsx';
import { Trash2, Star } from 'lucide-react';

interface TemplateGalleryProps {
  templates: Template[];
  onSelect: (template: Template) => void;
  onDelete?: (id: string) => void;
  favoriteIds?: string[];
  onToggleFavorite?: (id: string) => void;
  className?: string;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ templates, onSelect, onDelete, favoriteIds, onToggleFavorite, className }) => {
  return (
    <div className={clsx("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4", className)}>
      {templates.map((template: Template) => {
        const Icon = template.icon;
        const isFavorite = favoriteIds?.includes(template.id);
        return (
          <div
            key={template.id}
            className="relative flex flex-col items-start p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all duration-200 group text-left cursor-pointer"
            onClick={() => onSelect(template)}
          >
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(template.id);
                }}
                className={clsx(
                  "absolute top-2 p-1.5 rounded-md transition-all duration-200 z-10",
                  template.isCustom ? "right-10" : "right-2",
                  isFavorite 
                    ? "text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 opacity-100" 
                    : "text-slate-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 opacity-0 group-hover:opacity-100"
                )}
                title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              >
                <Star className={clsx("w-4 h-4", isFavorite && "fill-current")} />
              </button>
            )}
            {template.isCustom && onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(template.id);
                }}
                className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                title="Delete Template"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <div className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-slate-700 mb-3 transition-colors">
              <Icon className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
              {template.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {template.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default TemplateGallery;
import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { X, Package, CheckCircle, Circle } from 'lucide-react';

export const PluginsModal: React.FC = () => {
  const { showPlugins, togglePluginsModal, plugins, enablePlugin, disablePlugin } = useAppStore();

  if (!showPlugins) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[600px] max-h-[80vh] flex flex-col border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold flex items-center">
            <Package className="mr-2" size={20} /> Plugin Manager
          </h2>
          <button onClick={togglePluginsModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {plugins.map(plugin => (
            <div key={plugin.id} className="flex items-start justify-between p-4 mb-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{plugin.name} <span className="text-xs text-gray-500 ml-2">v{plugin.version}</span></h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{plugin.description}</p>
                <p className="text-xs text-gray-400 mt-2">By {plugin.author}</p>
              </div>
              <button
                onClick={() => plugin.enabled ? disablePlugin(plugin.id) : enablePlugin(plugin.id)}
                className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  plugin.enabled 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                }`}
              >
                {plugin.enabled ? <><CheckCircle size={14} className="mr-1" /> Enabled</> : <><Circle size={14} className="mr-1" /> Disabled</>}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
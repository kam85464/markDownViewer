import React, { useEffect } from 'react';
import { Layout } from './components/Layout';
import { useAppStore } from './store/useAppStore';
import { settingsService } from './services/settingsService';

const App: React.FC = () => {
  const { isDarkMode } = useAppStore();

  useEffect(() => {
    // Initialize settings cache on app start
    settingsService._init?.();
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  return <Layout />;
};

export default App;
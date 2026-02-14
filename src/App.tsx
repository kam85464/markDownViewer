import React, { useEffect } from 'react';
import { Layout } from './components/Layout';
import { useAppStore } from './store/useAppStore';

const App: React.FC = () => {
  const { isDarkMode } = useAppStore();

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  return <Layout />;
};

export default App;
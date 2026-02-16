import React, { useEffect } from 'react';
import { Layout } from './components/Layout';
import { useAppStore } from './store/useAppStore';

const App: React.FC = () => {
  const { isDarkMode, edgeStyle } = useAppStore();

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.classList.remove('sharp', 'rounded', 'curved');
    root.classList.add(edgeStyle);

  }, [isDarkMode, edgeStyle]);

  return <Layout />;
};

export default App;
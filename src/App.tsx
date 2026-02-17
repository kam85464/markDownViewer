import React, { useEffect } from 'react';
import { Layout } from './components/Layout';
import { useAppStore } from './store/useAppStore';
import OfflineBanner from './OfflineBanner';

const App: React.FC = () => {
  const { isDarkMode, edgeStyle } = useAppStore();

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

  return (
    <>
      <OfflineBanner />
      <Layout />
    </>
  );
};

export default App;
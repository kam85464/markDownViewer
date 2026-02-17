import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import { createHtmlPlugin } from 'vite-plugin-html'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'Markdown Viewer Pro',
        },
        tags: [
          {
            injectTo: 'head',
            tag: 'meta',
            attrs: { property: 'og:type', content: 'website' },
          },
          {
            injectTo: 'head',
            tag: 'meta',
            attrs: { property: 'og:url', content: 'https://mark-down-viewer.vercel.app/' },
          },
          {
            injectTo: 'head',
            tag: 'meta',
            attrs: { property: 'og:title', content: 'Markdown Viewer Pro' },
          },
          {
            injectTo: 'head',
            tag: 'meta',
            attrs: { property: 'og:description', content: 'A powerful Markdown viewer built with Electron and React.' },
          },
          {
            injectTo: 'head',
            tag: 'meta',
            attrs: { property: 'og:image', content: '/logo.png' },
          },
          {
            injectTo: 'head',
            tag: 'meta',
            attrs: { name: 'theme-color', content: '#2563eb' },
          },
          {
            injectTo: 'head',
            tag: 'meta',
            attrs: { name: 'apple-mobile-web-app-capable', content: 'yes' },
          },
          {
            injectTo: 'head',
            tag: 'meta',
            attrs: { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
          },
          // Add Twitter tags similarly if needed
        ],
      },
    }),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['logo.png', 'robots.txt', 'sitemap.xml', 'offline.html'],
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'Markdown Viewer Pro',
        short_name: 'MD Viewer',
        description: 'A powerful Markdown viewer built with Electron and React.',
        theme_color: '#2563eb',
        background_color: '#1e293b',
        display: 'fullscreen',
        icons: [
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
    react(),
    electron([
      {
        // Main-Process entry file of the Electron App.
        entry: 'electron/main.ts',
      },
      {
        entry: 'electron/preload.ts',
        onstart(options) {
          options.reload()
        },
      },
    ]),
    renderer(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  
  optimizeDeps: {
    include: ['reveal.js', 'monaco-vim', 'monaco-editor', 'prettier'],
  },
  
  build: {
    chunkSizeWarningLimit: 4000,
    rollupOptions: {
      output: {
        manualChunks: {
          'mermaid': ['mermaid'],
          'monaco': ['monaco-editor', 'monaco-vim'],
          'markdown': ['marked', 'markdown-it'],
          'math': ['katex'],
        },
      },
    },
  },
})
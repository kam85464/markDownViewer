import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import { createHtmlPlugin } from 'vite-plugin-html'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'
import path from 'path'
import crypto from 'crypto'

export default defineConfig(({ mode }) => {
  const nonce = crypto.randomBytes(16).toString('base64')
  const isDev = mode === 'development'
  const csp = isDev
    ? `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; worker-src 'self' blob:; connect-src 'self' https:;`
    : `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; worker-src 'self' blob:; connect-src 'self' https:;`

  return {
  plugins: [
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'Markdown Viewer Pro',
          nonce,
          csp,
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
          {
            injectTo: 'head',
            tag: 'meta',
            attrs: { name: 'mobile-web-app-capable', content: 'yes' },
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
        maximumFileSizeToCacheInBytes: 12 * 1024 * 1024,
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
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    monacoEditorPlugin({
      language: ['markdown', 'javascript', 'typescript', 'html', 'css', 'json', 'yaml', 'xml', 'bash', 'shell', 'python', 'java', 'sql'],
      features: [
        '!contextmenu',
        '!snippets',
        '!suggest',
        '!parameterHints',
        '!codeAction',
        '!codelens',
        '!rename',
        '!colorPicker',
        '!accessibilityHelp',
        '!iPadShowKeyboard',
      ],
    }),
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
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('mermaid') || id.includes('monaco-editor') || id.includes('monaco-vim')) {
              return 'editor'
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler') || id.includes('zustand')) {
              return 'framework'
            }
            if (id.includes('marked') || id.includes('markdown-it') || id.includes('highlight.js') || id.includes('micromark') || id.includes('decode-named-character-reference')) {
              return 'markdown'
            }
            if (id.includes('katex')) {
              return 'math'
            }
            if (id.includes('d3') || id.includes('dagre') || id.includes('lodash') || id.includes('khroma')) {
              return 'utils'
            }
            return 'vendor'
          }
        },
      },
    },
  },
}
})
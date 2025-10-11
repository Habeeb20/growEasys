// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo192.png', 'logo512.png'],
      manifest: {
        name: 'growEasy',
        short_name: 'growEasy',
        description: 'A fast and secure platform for professionals',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'logo192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'logo512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        // Cache static assets
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // Cache API responses for offline fallback
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'), // Adjust to your backend URL (e.g., http://localhost:3000/api/)
            handler: 'StaleWhileRevalidate', // Serve cached response, update in background
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for 7 days
              },
              cacheableResponse: {
                statuses: [0, 200], // Cache successful responses and opaque responses
              },
            },
          },
        ],
      },
    }),
  ],
});
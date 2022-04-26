import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'formatjs',
            {
              idInterpolationPattern: '[sha512:contenthash:base64:6]',
              ast: true,
            },
          ],
        ],
      },
    }),
  ],
  define: {
    'process.env.RUN_ENV': '"development"',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080/',
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  assetsInclude: [/\.gltf$/],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          cannon: ['cannon-es'],
          ui: [
            '@mantine/core',
            '@mantine/hooks',
            '@mantine/form',
            '@mantine/notifications',
            '@mantine/spotlight',
            'framer-motion',
            'react-error-boundary',
            'react-hook-form',
            'react-icons',
            'react-intl',
            'react-jss',
          ],
          api: [
            'recoil',
            'graphql',
            'graphql-tag',
            'graphql-ws',
            'history',
            'msw',
            'react-router-dom',
            'urql',
            '@urql/devtools',
            '@urql/exchange-auth',
            '@urql/exchange-graphcache',
          ],
          mdx: ['@mdx-js/runtime'],
        },
      },
    },
  },
});

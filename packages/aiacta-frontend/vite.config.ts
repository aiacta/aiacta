import reactRefresh from '@vitejs/plugin-react-refresh';
import { createHash } from 'crypto';
import { defineConfig, Plugin } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), reactIntl()],
  define: {
    'process.env.RUN_ENV': '"development"',
    'window.process': '{cwd(){}}',
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
            '@mantine/notifications',
            'draft-js',
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

function reactIntl() {
  let isProduction = false;
  return {
    name: 'vite-plugin-react-intl',
    configResolved(config) {
      isProduction = config.isProduction;
    },
    transform(src) {
      const matches = [
        ...src.matchAll(
          /((?:React.createElement\(FormattedMessage,\s*{\s*)|(?:formatMessage\(\s*{\s*))(defaultMessage:\s*(["'`])((?:.|\s)+?)\3,?)/gm,
        ),
      ];
      if (matches.length > 0) {
        const code = matches.reduce((code, match) => {
          const hash = createHash('sha512');
          hash.update(match[4]);
          return code
            .split(match[0])
            .join(
              match[0]
                .replace(
                  match[1],
                  match[1] + `id: "${hash.digest('base64').substr(0, 6)}", `,
                )
                .replace(match[2], isProduction ? '' : match[2]),
            );
        }, src);
        return {
          code,
        };
      }
      return;
    },
  } as Plugin;
}

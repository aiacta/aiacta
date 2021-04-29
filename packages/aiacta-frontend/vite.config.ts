import reactRefresh from '@vitejs/plugin-react-refresh';
import { createHmac } from 'crypto';
import { defineConfig, Plugin } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), reactIntl()],
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
          /(React.createElement\(FormattedMessage,\s*{\s*)(defaultMessage:\s*(["'`])((?:.|\s)+?)\3,?)/gm,
        ),
      ];
      if (matches.length > 0) {
        const code = matches.reduce((code, match) => {
          const hash = createHmac('sha512', 'my-plugin');
          hash.update(match[4]);
          return code
            .split(match[0])
            .join(
              match[0]
                .replace(
                  match[1],
                  match[1] +
                    `id: "${Buffer.from(hash.digest('hex'))
                      .toString('base64')
                      .substr(0, 6)}", `,
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

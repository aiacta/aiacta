import { pnpPlugin } from '@yarnpkg/esbuild-plugin-pnp';
import { build } from 'esbuild';

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node14',
  plugins: [pnpPlugin()],
  outdir: 'dist',
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});

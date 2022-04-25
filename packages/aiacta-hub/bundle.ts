import { pnpPlugin } from '@yarnpkg/esbuild-plugin-pnp';
import { build } from 'esbuild';

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node16',
  plugins: [pnpPlugin()],
  outdir: 'dist',
  define: {
    'process.env.NODE_ENV': '"production"',
  },
}).then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);

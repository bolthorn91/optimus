import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { chunkReportPlugin } from './tooling/chunk-report-plugin';

export default defineConfig({
  plugins: [react(), chunkReportPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    // No named chunk for three: Rollup hoistaría React+WebGL a la entrada y rompería I9.
    // El aislamiento lo hace React.lazy en NightfallStage.
  },
});

import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { WEBGL_CHUNK_NAME, isWebglModule } from './tooling/bundle-policy.js';
import { chunkReportPlugin } from './tooling/chunk-report-plugin';
import { fontPreloadPlugin } from './tooling/font-preload-plugin';

export default defineConfig({
  plugins: [react(), chunkReportPlugin(), fontPreloadPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          return isWebglModule(id) ? WEBGL_CHUNK_NAME : undefined;
        },
      },
    },
  },
});

import { defineConfig } from 'vite';

export default defineConfig({
  base: '/the-chosen-word/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    open: '/the-chosen-word/',
  },
});

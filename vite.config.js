import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  plugins: [],
  build: {
    outDir: 'dist',
    target: 'es2020'
  }
});

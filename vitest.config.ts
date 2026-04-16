import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // pure calculation/util tests run in node by default
    // component tests use // @vitest-environment happy-dom docblock pragma
    environment: 'node',
    // explicit imports in test files (no globals injection)
    globals: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});

import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

/**
 * Extiende la configuración de Vite en vez de repetirla: el alias `@/` se declara una sola vez
 * (F4) y no puede desincronizarse entre la build y los tests.
 */
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.{test,spec}.{ts,tsx}', 'tooling/**/*.{test,spec}.ts'],
      restoreMocks: true,
      unstubEnvs: true,
      unstubGlobals: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'lcov'],
        reportsDirectory: './coverage',
        // Perfil §5: el gate de cobertura cubre solo la lógica pura.
        include: ['src/lib/**/*.ts', 'src/hooks/**/*.ts', 'src/**/*.logic.ts'],
        exclude: ['**/*.test.ts', '**/*.test.tsx', '**/*.d.ts'],
        thresholds: {
          lines: 80,
          branches: 80,
          functions: 80,
          statements: 80,
        },
      },
    },
  }),
);

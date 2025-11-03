import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'tests/e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      setupFiles: ['./src/__tests__/setup.ts'],
      globals: true,
      testTimeout: 10000, // 10 seconds for async operations
      hookTimeout: 10000, // 10 seconds for setup/teardown
      server: {
        deps: {
          inline: [
            'quasar',
            '@quasar/extras',
            'vue-router',
            'pinia',
            'webidl-conversions',
            'whatwg-url',
          ],
        },
      },
      pool: 'forks',
      poolOptions: {
        forks: {
          singleFork: true,
        },
      },
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        thresholds: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
        exclude: [
          'node_modules/',
          'src/__tests__/',
          'src/main.ts',
          'src/router/index.ts',
          '**/*.d.ts',
          '**/*.config.*',
          '**/coverage/**',
          'tests/e2e/**',
        ],
      },
    },
  }),
)

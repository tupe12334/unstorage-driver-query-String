import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      exclude: ['**/*.test.ts'],
      tsconfigPath: './tsconfig.build.json'
    })
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'UnstorageDriverQueryString',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`
    },
    rollupOptions: {
      external: ['unstorage', 'qs', 'lodash', 'validator', 'tiny-invariant', 'history']
    }
  },
  test: {
    environment: 'jsdom',
    globals: true
  }
})
import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    minify: true,
    treeshake: true,
    outDir: 'dist',
    target: 'es2020',
    outExtension({ format }) {
        return {
            js: format === 'esm' ? '.mjs' : '.cjs',
        };
    },
});

import { defineVitestConfig } from '@nuxt/test-utils/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { fileURLToPath } from 'node:url';

export default defineVitestConfig({
	test: {
		environment: 'happy-dom',
		environmentOptions: {
			nuxt: {
				rootDir: fileURLToPath(new URL('./', import.meta.url)),
				domEnvironment: 'happy-dom'
			}
		},
		environmentMatchGlobs: [['src/**/*.nuxt.spec.ts', 'nuxt']]
	},
	plugins: [tsconfigPaths()]
});

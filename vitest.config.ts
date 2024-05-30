import { defineVitestConfig } from '@nuxt/test-utils/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { fileURLToPath } from 'node:url';

export default defineVitestConfig({
	test: {
		environment: 'nuxt',
		environmentOptions: {
			nuxt: {
				rootDir: fileURLToPath(new URL('./', import.meta.url)),
				domEnvironment: 'happy-dom'
			}
		}
	},
	plugins: [tsconfigPaths()]
});

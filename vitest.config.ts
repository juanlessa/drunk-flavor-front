import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { defineVitestProject } from '@nuxt/test-utils/config';
import vue from '@vitejs/plugin-vue';

const appDir = fileURLToPath(new URL('./app', import.meta.url));

export default defineConfig({
	test: {
		projects: [
			{
				plugins: [vue()],
				resolve: {
					alias: {
						'~': appDir,
						'@': appDir
					}
				},
				test: {
					name: 'unit',
					include: ['app/**/*.spec.ts'],
					exclude: ['app/**/*.nuxt.spec.ts'],
					environment: 'happy-dom',
					setupFiles: ['./vitest.setup.ts']
				}
			} as any,
			await defineVitestProject({
				test: {
					name: 'nuxt',
					include: ['app/**/*.nuxt.spec.ts'],
					environment: 'nuxt'
				}
			})
		]
	}
});

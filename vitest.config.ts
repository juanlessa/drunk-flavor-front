import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { defineVitestProject } from '@nuxt/test-utils/config';
import vue from '@vitejs/plugin-vue';

const appDir = fileURLToPath(new URL('./app', import.meta.url));

export default defineConfig({
	test: {
		projects: [
			{
				resolve: {
					alias: { '~': appDir, '@': appDir }
				},
				test: {
					name: 'node',
					environment: 'node',
					include: ['app/helpers/**/*.spec.ts', 'app/**/*.helpers.spec.ts']
				}
			},
			{
				plugins: [vue()],
				resolve: {
					alias: { '~': appDir, '@': appDir }
				},
				test: {
					name: 'happy-dom',
					include: ['app/**/*.spec.ts'],
					exclude: [
						'app/**/*.nuxt.spec.ts',
						'app/helpers/**/*.spec.ts',
						'app/**/*.helpers.spec.ts'
					],
					environment: 'happy-dom',
					setupFiles: ['./vitest.setup.ts']
				}
			},
			await defineVitestProject({
				test: {
					name: 'nuxt',
					include: ['app/**/*.nuxt.spec.ts'],
					environment: 'nuxt',
					setupFiles: ['./vitest.nuxt.setup.ts']
				}
			})
		]
	}
});

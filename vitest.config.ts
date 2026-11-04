import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { defineVitestProject } from '@nuxt/test-utils/config';
import vue from '@vitejs/plugin-vue';

const appDir = fileURLToPath(new URL('./app', import.meta.url));

export default defineConfig({
	test: {
		// Coverage is configured at the root: it is global across all projects (node, happy-dom, nuxt).
		coverage: {
			provider: 'v8',
			reportsDirectory: './coverage',
			// text-summary prints totals in the terminal; json-summary and json feed the PR comment action.
			reporter: ['text-summary', 'html', 'lcov', 'json-summary', 'json'],
			// List source files explicitly so untested files (e.g. pages, layouts) show up as 0%.
			include: ['app/**/*.{ts,vue}'],
			exclude: [
				'app/**/*.spec.ts',
				'app/test/**',
				'app/**/*.story.vue',
				'app/**/*.d.ts',
				// Pure type declarations and static constants produce no meaningful coverage signal.
				'app/**/*.types.ts',
				'app/**/*.constants.ts',
				'app/types/**',
				// Presentational SVG components without logic.
				'app/components/icons/**',
				// Histoire-only setup, not part of the shipped app.
				'app/histoire.setup.ts'
			]
		},
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
						'app/**/*.helpers.spec.ts',
						'app/**/*.a11y.spec.ts'
					],
					environment: 'happy-dom',
					setupFiles: ['./vitest.setup.ts']
				}
			},
			{
				plugins: [vue()],
				resolve: {
					alias: { '~': appDir, '@': appDir }
				},
				test: {
					name: 'a11y',
					include: ['app/**/*.a11y.spec.ts'],
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

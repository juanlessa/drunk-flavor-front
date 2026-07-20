import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },

	compatibilityDate: '2026-07-15',

	app: {
		head: {
			meta: [{ name: 'theme-color', content: '#1D4ED8' }]
		}
	},

	runtimeConfig: {
		public: {
			apiBase: ''
		}
	},

	vite: {
		plugins: [tailwindcss()]
	},

	css: ['~/styles/global.css'],

	components: [
		{
			path: '~/components',
			pathPrefix: false
		}
	],

	imports: {
		dirs: [
			'composables', // top-level modules
			'composables/**' // scan all modules within given directory
		]
	},

	typescript: {
		tsConfig: {
			compilerOptions: {
				types: ['@nuxtjs/i18n']
			}
		}
	},

	i18n: {
		strategy: 'no_prefix',
		defaultLocale: 'en',
		locales: [
			{ code: 'en', name: 'English', file: 'en.json' },
			{ code: 'pt', name: 'Português', file: 'pt.json' }
		],
		experimental: {
			typedOptionsAndMessages: 'default'
		}
	},

	modules: [
		'nuxt-typed-router',
		'@vueuse/nuxt',
		'@nuxt/test-utils/module',
		'@nuxt/eslint',
		...(process.env.HISTOIRE ? [] : ['@nuxtjs/i18n'])
	]
});

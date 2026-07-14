import { colors } from './src/tokens';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },

	app: {
		head: {
			meta: [{ name: 'theme-color', content: colors.blue[700] }]
		}
	},

	runtimeConfig: {
		public: {
			apiBase: ''
		}
	},

	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {}
		}
	},

	srcDir: 'src/',
	dir: {
		public: '../public'
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
			},
			include: ['./env.d.ts']
		}
	},

	i18n: {
		vueI18n: './i18n.config.ts',
		strategy: 'no_prefix',
		defaultLocale: 'en',
		locales: ['en', 'pt']
	},

	modules: [
		'nuxt-typed-router',
		'@vueuse/nuxt',
		'@nuxt/test-utils/module',
		'@nuxt/eslint',
		...(process.env.HISTOIRE ? [] : ['@nuxtjs/i18n'])
	]
});

import tailwindcss from '@tailwindcss/vite';
import { parseEnvs } from './env/index';
import { securityOptions } from './config/security';

const { NODE_ENV, HISTOIRE } = parseEnvs();

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: NODE_ENV !== 'production' },

	compatibilityDate: '2026-07-15',

	runtimeConfig: {
		public: {
			apiBase: '',
			googleClientId: '',
			histoire: HISTOIRE
		}
	},

	vite: {
		plugins: [tailwindcss()]
	},

	css: [
		'@fontsource/roboto/latin-400.css',
		'@fontsource/roboto/latin-500.css',
		'@fontsource/roboto/latin-700.css',
		'~/styles/global.css'
	],

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
		// Every language lives under its own prefix (/en, /pt), so each page has one crawlable URL per
		// language and prefixed URLs are never redirected (search engines and shared links get exactly
		// the page they asked for). Paths without a prefix (the bare domain, links in emails, typed
		// URLs) are language-neutral entry points: they redirect to the cookie choice, then the
		// browser language, then English. Never link to an unprefixed path from the app or SEO tags.
		strategy: 'prefix',
		defaultLocale: 'en',
		locales: [
			{ code: 'en', name: 'English', file: 'en.json' },
			{ code: 'pt', name: 'Português', file: 'pt.json' }
		],
		detectBrowserLanguage: {
			useCookie: true,
			cookieKey: 'i18n_redirected',
			// Detects the language only on unprefixed paths, which have no page of their own. 'root'
			// would redirect the bare domain only and leave every other unprefixed path (email links)
			// as a 404; 'all' would also redirect explicit /en and /pt URLs, which must never happen.
			redirectOn: 'no prefix'
		},
		experimental: {
			typedOptionsAndMessages: 'default'
		}
	},

	modules: [
		'nuxt-typed-router',
		'@vueuse/nuxt',
		'@nuxt/test-utils/module',
		'@nuxt/eslint',
		'nuxt-security',
		...(HISTOIRE ? [] : ['@nuxtjs/i18n'])
	],

	security: securityOptions
});

import tailwindcss from '@tailwindcss/vite';
import { parseEnvs } from './env/index';
import { securityOptions } from './config/security';

const { NODE_ENV, HISTOIRE, NUXT_PUBLIC_SITE_URL } = parseEnvs();

// `language` feeds <html lang> and hreflang. Plain 'pt' (not 'pt-BR') so the Portuguese pages stay
// the match for every Portuguese-speaking region.
const LOCALES = [
	{ code: 'en', language: 'en', name: 'English', file: 'en.json' },
	{ code: 'pt', language: 'pt', name: 'Português', file: 'pt.json' }
] as const satisfies { code: string; language: string; name: string; file: string }[];

/**
 * Pages kept out of the index and the sitemap (Nitro route patterns, without the language prefix):
 * auth flows, one-time token links and everything behind sign-in. Applied as `robots: false` route
 * rules per language, because `definePageMeta({ robots })` matches unprefixed page paths and never
 * reaches the /en and /pt routes.
 */
const NOINDEX_PATHS = [
	'/signin',
	'/signup',
	'/forgot-password',
	'/verify-email/**',
	'/confirm-password/**',
	'/ownership-transfer/**',
	'/complete-profile',
	'/profile',
	'/categories/**',
	'/units/**',
	'/ingredients/**',
	'/users/**',
	'/drinks',
	'/drinks/new',
	'/drinks/*/edit'
];

/**
 * Areas that only exist behind sign-in (robots.txt syntax). Crawlers are kept out of them to save
 * crawl budget. The admin drinks list is matched exactly (`$`) because /drinks/<id> is a public page.
 */
const PRIVATE_PATHS = [
	'/categories',
	'/units',
	'/ingredients',
	'/users',
	'/profile',
	'/complete-profile',
	'/ownership-transfer',
	'/drinks$',
	'/drinks/new',
	'/drinks/*/edit'
];

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

	// Canonical origin and brand used by the sitemap, robots and i18n SEO tags. The URL is also read
	// from NUXT_PUBLIC_SITE_URL at runtime, so the server environment must carry the same value.
	site: {
		url: NUXT_PUBLIC_SITE_URL,
		name: 'DrunkFlavor'
	},

	routeRules: Object.fromEntries(
		LOCALES.flatMap(({ code }) =>
			NOINDEX_PATHS.map((path) => [`/${code}${path}`, { robots: false }])
		)
	),

	robots: {
		disallow: LOCALES.flatMap(({ code }) => PRIVATE_PATHS.map((path) => `/${code}${path}`))
	},

	sitemap: {
		// Drink pages are dynamic, so they come from the API; static public pages are added automatically.
		sources: ['/api/__sitemap__/drinks']
	},

	i18n: {
		// Builds the fully-qualified hreflang and canonical URLs.
		baseUrl: NUXT_PUBLIC_SITE_URL,
		// Every language lives under its own prefix (/en, /pt), so each page has one crawlable URL per
		// language and prefixed URLs are never redirected (search engines and shared links get exactly
		// the page they asked for). Paths without a prefix (the bare domain, links in emails, typed
		// URLs) are language-neutral entry points: they redirect to the cookie choice, then the
		// browser language, then English. Never link to an unprefixed path from the app or SEO tags.
		strategy: 'prefix',
		defaultLocale: 'en',
		locales: LOCALES,
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
		...(HISTOIRE ? [] : ['@nuxtjs/i18n', '@nuxtjs/robots', '@nuxtjs/sitemap'])
	],

	security: securityOptions
});

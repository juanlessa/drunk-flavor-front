import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: process.env.NODE_ENV !== 'production' },

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
		'nuxt-security',
		...(process.env.HISTOIRE ? [] : ['@nuxtjs/i18n'])
	],

	// OWASP-aligned security response headers (audit finding M-1).
	// Based on the nuxt-security "Default Strict CSP" recipe with per-request nonces.
	// See: https://nuxt-security.vercel.app/headers/csp
	security: {
		// Inject a per-request nonce into SSR-rendered scripts so the strict CSP
		// can use 'strict-dynamic' + 'nonce-...' instead of 'unsafe-inline' for scripts.
		nonce: true,
		// Enable Subresource Integrity for bundled assets.
		sri: true,
		headers: {
			contentSecurityPolicy: {
				'script-src': [
					"'self'", // Level-3 fallback, ignored by modern browsers when strict-dynamic + nonce apply
					'https:', // Level-3 fallback
					"'unsafe-inline'", // Level-2 fallback for very old browsers
					"'strict-dynamic'", // Strict CSP: trust scripts loaded by the nonced root script
					"'nonce-{{nonce}}'" // Per-request nonce injected by nuxt-security in SSR
				],
				// Nuxt + Tailwind emit inline styles, so 'unsafe-inline' for styles is the
				// documented recommended default. Do NOT nonce styles (breaks Nuxt/Tailwind).
				'style-src': ["'self'", 'https:', "'unsafe-inline'"],
				// Only self-hosted images and inline data URIs are used (public/ has local assets only).
				'img-src': ["'self'", 'data:'],
				// Fonts are self-hosted via @fontsource/roboto; keep https:/data: for safety.
				'font-src': ["'self'", 'https:', 'data:'],
				// Allow SSR/SPA fetch to the production backend API origin.
				// Dev (http://localhost:3333) still works because nuxt-security relaxes CSP in dev.
				'connect-src': ["'self'", 'https://api.drunkflavor.com'],
				'base-uri': ["'none'"],
				'object-src': ["'none'"],
				'script-src-attr': ["'none'"],
				// Clickjacking protection (equivalent/stronger than X-Frame-Options).
				'frame-ancestors': ["'self'"],
				'upgrade-insecure-requests': true
			},
			// HSTS is owned exclusively by the Nginx/Certbot layer on the VPS, which
			// introduces Strict-Transport-Security with a short max-age first and raises
			// it on a staged schedule. Disable it here so the app (Nitro) is NOT a second
			// source of HSTS — single source of truth at the edge/TLS terminator.
			strictTransportSecurity: false
		}
	}
});

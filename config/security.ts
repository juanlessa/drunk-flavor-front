import type { ModuleOptions as SecurityModuleOptions } from 'nuxt-security';
import { parseEnvs } from '../env/index';

const { NODE_ENV, NUXT_PUBLIC_API_BASE, NUXT_PUBLIC_IMAGE_HOST } = parseEnvs();

const isProduction = NODE_ENV === 'production';

type SecurityHeaders = Exclude<NonNullable<SecurityModuleOptions['headers']>, false>;
type CspDirectives = NonNullable<SecurityHeaders['contentSecurityPolicy']>;

const commonCspDirectives: CspDirectives = {
	'script-src': [
		"'self'", // Level-3 fallback, ignored by modern browsers when strict-dynamic + nonce apply
		'https:', // Level-3 fallback
		"'unsafe-inline'", // Level-2 fallback for very old browsers
		"'strict-dynamic'", // Strict CSP: trust scripts loaded by the nonced root script
		"'nonce-{{nonce}}'" // Per-request nonce injected by nuxt-security in SSR
	],
	'style-src': ["'self'", 'https:', "'unsafe-inline'"],
	'font-src': ["'self'", 'https:', 'data:'],
	'base-uri': ["'none'"],
	'object-src': ["'none'"],
	'script-src-attr': ["'none'"],
	'frame-ancestors': ["'self'"]
};

const weakCspDirectives: CspDirectives = {
	'img-src': ["'self'", 'data:', 'blob:', 'https:'],
	'upgrade-insecure-requests': false
};

const productionCspDirectives: CspDirectives = {
	'img-src': ["'self'", 'data:', NUXT_PUBLIC_IMAGE_HOST],
	'connect-src': ["'self'", NUXT_PUBLIC_API_BASE],
	'upgrade-insecure-requests': true
};

const contentSecurityPolicy: CspDirectives = {
	...commonCspDirectives,
	...(isProduction ? productionCspDirectives : weakCspDirectives)
};

export const securityOptions: Partial<SecurityModuleOptions> = {
	nonce: true,
	sri: true,
	headers: {
		contentSecurityPolicy,
		strictTransportSecurity: false
	}
};

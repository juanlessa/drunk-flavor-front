import { z } from 'zod/v4';
import { type NodeEnv, parseNodeEnv } from './node';

const HTTP_PROTOCOL = /^https?$/; // http or https

const DEFAULT_API_BASE = 'http://localhost:3333';
const DEFAULT_IMAGE_HOST = 'http://localhost:3333';
const DEFAULT_SITE_URL = 'http://localhost:3000';

const isBareOrigin = (value: string): boolean => {
	try {
		return new URL(value).origin === value;
	} catch {
		return false;
	}
};

const bareOriginSchema = z.url({ protocol: HTTP_PROTOCOL }).refine(isBareOrigin, {
	error: 'Must be a bare origin with no path, query, fragment or trailing slash'
});

/**
 * Builds the environment schema.
 *
 * `strict` makes the public origins and the Google client id required, with no defaults. It is
 * used when the server starts in production (see `parseRuntimeEnvs`), so a missing value stops the
 * process instead of shipping a wrong origin. The build never needs these values: they are read
 * from the server environment at runtime, so the lenient schema falls back to local defaults.
 */
export const buildEnvsSchema = (strict: boolean) => {
	const apiBase = strict ? bareOriginSchema : bareOriginSchema.default(DEFAULT_API_BASE);
	const imageHost = strict ? bareOriginSchema : bareOriginSchema.default(DEFAULT_IMAGE_HOST);
	// Public origin of this site. Every canonical, hreflang and sitemap URL is built from it, so a
	// wrong value in production would point search engines elsewhere: required there, no default.
	const siteUrl = strict ? bareOriginSchema : bareOriginSchema.default(DEFAULT_SITE_URL);
	// Public OAuth client id (not a secret). Required in production; optional elsewhere so
	// the app still runs locally without Google sign-in configured.
	const googleClientId = strict ? z.string().trim().min(1) : z.string().trim().optional();
	// Base URL of the i18n SEO tags (canonical, hreflang, og:url). `@nuxtjs/i18n` reads it from this
	// name and cannot take it from NUXT_PUBLIC_SITE_URL, so production must carry both with one value.
	const i18nBaseUrl = strict ? bareOriginSchema : bareOriginSchema.optional();
	const schema = z.object({
		NUXT_PUBLIC_API_BASE: apiBase,
		NUXT_PUBLIC_IMAGE_HOST: imageHost,
		NUXT_PUBLIC_SITE_URL: siteUrl,
		NUXT_PUBLIC_I18N_BASE_URL: i18nBaseUrl,
		NUXT_PUBLIC_GOOGLE_CLIENT_ID: googleClientId,
		HISTOIRE: z.coerce.boolean().default(false)
	});
	if (!strict) return schema;
	return schema.refine((envs) => envs.NUXT_PUBLIC_I18N_BASE_URL === envs.NUXT_PUBLIC_SITE_URL, {
		path: ['NUXT_PUBLIC_I18N_BASE_URL'],
		error: 'Must be equal to NUXT_PUBLIC_SITE_URL'
	});
};

export type EnvsSchema = z.infer<ReturnType<typeof buildEnvsSchema>> & { NODE_ENV: NodeEnv };

/**
 * Parses the environment for build-time configuration (`nuxt.config.ts`, `config/security.ts`).
 * Never requires the public origins, so installs, `nuxt prepare` and builds work without them.
 */
export const parseEnvs = (
	source: NodeJS.ProcessEnv = process.env,
	nodeEnv?: NodeEnv
): EnvsSchema => {
	const resolvedNodeEnv = nodeEnv ?? parseNodeEnv(source).NODE_ENV;
	const envs = buildEnvsSchema(false).parse(source);
	return { NODE_ENV: resolvedNodeEnv, ...envs };
};

/**
 * Parses the environment of the running server. In production every public origin and the Google
 * client id must be present and valid; other environments keep the local defaults.
 */
export const parseRuntimeEnvs = (
	source: NodeJS.ProcessEnv = process.env,
	nodeEnv?: NodeEnv
): EnvsSchema => {
	const resolvedNodeEnv = nodeEnv ?? parseNodeEnv(source).NODE_ENV;
	const envs = buildEnvsSchema(resolvedNodeEnv === 'production').parse(source);
	return { NODE_ENV: resolvedNodeEnv, ...envs };
};

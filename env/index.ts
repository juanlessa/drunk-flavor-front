import { z } from 'zod/v4';
import { type NodeEnv, parseNodeEnv } from './node';

const HTTP_PROTOCOL = /^https?$/; // http or https

const DEFAULT_API_BASE = 'http://localhost:3333';
const DEFAULT_IMAGE_HOST = 'http://localhost:3333';

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

export const buildEnvsSchema = (nodeEnv: NodeEnv) => {
	const isProduction = nodeEnv === 'production';

	const apiBase = isProduction ? bareOriginSchema : bareOriginSchema.default(DEFAULT_API_BASE);
	const imageHost = isProduction
		? bareOriginSchema
		: bareOriginSchema.default(DEFAULT_IMAGE_HOST);

	// Public OAuth client id (not a secret). Required in production; optional elsewhere so
	// the app still runs locally without Google sign-in configured.
	const googleClientId = isProduction ? z.string().trim().min(1) : z.string().trim().optional();

	return z.object({
		NUXT_PUBLIC_API_BASE: apiBase,
		NUXT_PUBLIC_IMAGE_HOST: imageHost,
		NUXT_PUBLIC_GOOGLE_CLIENT_ID: googleClientId,
		HISTOIRE: z.coerce.boolean().default(false)
	});
};

export type EnvsSchema = z.infer<ReturnType<typeof buildEnvsSchema>> & { NODE_ENV: NodeEnv };

export const parseEnvs = (
	source: NodeJS.ProcessEnv = process.env,
	nodeEnv?: NodeEnv
): EnvsSchema => {
	const resolvedNodeEnv = nodeEnv ?? parseNodeEnv(source).NODE_ENV;
	const envs = buildEnvsSchema(resolvedNodeEnv).parse(source);
	return { NODE_ENV: resolvedNodeEnv, ...envs };
};

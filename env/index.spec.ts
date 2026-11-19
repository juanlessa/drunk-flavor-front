import { describe, expect, it } from 'vitest';
import { parseEnvs, parseRuntimeEnvs } from './index';

const validEnv = {
	NODE_ENV: 'production',
	NUXT_PUBLIC_API_BASE: 'https://api.example.com',
	NUXT_PUBLIC_IMAGE_HOST: 'https://cdn.example.com',
	NUXT_PUBLIC_SITE_URL: 'https://example.com',
	NUXT_PUBLIC_I18N_BASE_URL: 'https://example.com',
	NUXT_PUBLIC_GOOGLE_CLIENT_ID: 'client-id'
} as NodeJS.ProcessEnv;

describe('parseEnvs (build time)', () => {
	it('does not require the public origins in production', () => {
		const envs = parseEnvs({ NODE_ENV: 'production' } as NodeJS.ProcessEnv);

		expect(envs.NODE_ENV).toBe('production');
		expect(envs.NUXT_PUBLIC_API_BASE).toBe('http://localhost:3333');
		expect(envs.NUXT_PUBLIC_SITE_URL).toBe('http://localhost:3000');
	});

	it('still validates a value that is provided', () => {
		expect(() =>
			parseEnvs({
				NODE_ENV: 'production',
				NUXT_PUBLIC_API_BASE: 'not a url'
			} as NodeJS.ProcessEnv)
		).toThrow();
	});
});

describe('parseRuntimeEnvs', () => {
	it('accepts a complete production environment', () => {
		const envs = parseRuntimeEnvs(validEnv);

		expect(envs.NUXT_PUBLIC_API_BASE).toBe('https://api.example.com');
		expect(envs.NUXT_PUBLIC_GOOGLE_CLIENT_ID).toBe('client-id');
	});

	it.each([
		'NUXT_PUBLIC_API_BASE',
		'NUXT_PUBLIC_IMAGE_HOST',
		'NUXT_PUBLIC_SITE_URL',
		'NUXT_PUBLIC_I18N_BASE_URL',
		'NUXT_PUBLIC_GOOGLE_CLIENT_ID'
	])('rejects a production environment without %s', (key) => {
		const source = Object.fromEntries(
			Object.entries(validEnv).filter(([name]) => name !== key)
		) as NodeJS.ProcessEnv;

		expect(() => parseRuntimeEnvs(source)).toThrow();
	});

	it('rejects origins with a path or trailing slash in production', () => {
		expect(() =>
			parseRuntimeEnvs({ ...validEnv, NUXT_PUBLIC_SITE_URL: 'https://example.com/' })
		).toThrow();
	});

	it('rejects an i18n base URL that differs from the site URL', () => {
		expect(() =>
			parseRuntimeEnvs({
				...validEnv,
				NUXT_PUBLIC_I18N_BASE_URL: 'https://other.example.com'
			})
		).toThrow();
	});

	it('keeps the local defaults outside production', () => {
		const envs = parseRuntimeEnvs({ NODE_ENV: 'development' } as NodeJS.ProcessEnv);

		expect(envs.NUXT_PUBLIC_IMAGE_HOST).toBe('http://localhost:3333');
		expect(envs.NUXT_PUBLIC_GOOGLE_CLIENT_ID).toBeUndefined();
	});
});

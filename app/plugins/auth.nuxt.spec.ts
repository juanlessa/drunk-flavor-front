import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerEndpoint } from '@nuxt/test-utils/runtime';

const profileResponse = {
	id: 'user-1',
	name: 'John',
	surname: 'Doe',
	email: 'john@test.com',
	emailVerified: true,
	role: 'admin' as const,
	status: 'active' as const,
	createdAt: '2025-01-01T00:00:00.000Z',
	updatedAt: '2025-01-02T00:00:00.000Z',
	authenticationMethods: { password: { enabled: true }, providers: [] }
};

const mappedProfile = {
	...profileResponse,
	createdAt: new Date(profileResponse.createdAt),
	updatedAt: new Date(profileResponse.updatedAt)
};

describe('auth plugin', () => {
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	describe('plugin structure', () => {
		it('exposes state with isAuthenticated property', () => {
			const { $auth } = useNuxtApp();

			expect($auth.state.value).toHaveProperty('isAuthenticated');
		});

		it('exposes state with user property', () => {
			const { $auth } = useNuxtApp();

			expect($auth.state.value).toHaveProperty('user');
		});

		it('exposes authenticate as a function', () => {
			const { $auth } = useNuxtApp();

			expect(typeof $auth.authenticate).toBe('function');
		});

		it('exposes clear as a function', () => {
			const { $auth } = useNuxtApp();

			expect(typeof $auth.clear).toBe('function');
		});
	});

	describe('authenticate', () => {
		it('sets isAuthenticated true when profile endpoint succeeds', async () => {
			registerEndpoint('/me', { method: 'GET', handler: () => profileResponse });

			const { $auth } = useNuxtApp();
			$auth.state.value = { isAuthenticated: false, user: undefined };

			const result = await $auth.authenticate();

			expect(result).toBe(true);
			expect($auth.state.value.isAuthenticated).toBe(true);
		});

		it('sets user from profile response', async () => {
			registerEndpoint('/me', { method: 'GET', handler: () => profileResponse });

			const { $auth } = useNuxtApp();
			$auth.state.value = { isAuthenticated: false, user: undefined };

			await $auth.authenticate();

			expect($auth.state.value.user).toEqual(mappedProfile);
		});

		it('returns false when profile endpoint throws', async () => {
			registerEndpoint('/me', {
				method: 'GET',
				handler: () => {
					throw createError({ statusCode: 401 });
				}
			});

			const { $auth } = useNuxtApp();
			$auth.state.value = { isAuthenticated: false, user: undefined };

			const result = await $auth.authenticate();

			expect(result).toBe(false);
		});

		it('does not update state when profile endpoint throws', async () => {
			registerEndpoint('/me', {
				method: 'GET',
				handler: () => {
					throw createError({ statusCode: 401 });
				}
			});

			const { $auth } = useNuxtApp();
			$auth.state.value = { isAuthenticated: false, user: undefined };

			await $auth.authenticate();

			expect($auth.state.value.isAuthenticated).toBe(false);
			expect($auth.state.value.user).toBeUndefined();
		});
	});

	describe('clear', () => {
		it('resets the local authentication state without an API call', () => {
			const { $auth } = useNuxtApp();
			$auth.state.value = {
				isAuthenticated: true,
				user: {
					id: 'user-1',
					name: 'John',
					surname: 'Doe',
					email: 'john@test.com',
					role: 'member'
				} as never
			};

			$auth.clear();

			expect($auth.state.value).toEqual({ isAuthenticated: false, user: undefined });
		});
	});
});

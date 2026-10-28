import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerEndpoint } from '@nuxt/test-utils/runtime';

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
			const profile = {
				_id: 'user-1',
				name: 'John',
				surname: 'Doe',
				email: 'john@test.com',
				role: 'admin'
			};
			registerEndpoint('/me', { method: 'GET', handler: () => profile });

			const { $auth } = useNuxtApp();
			$auth.state.value = { isAuthenticated: false, user: undefined };

			const result = await $auth.authenticate();

			expect(result).toBe(true);
			expect($auth.state.value.isAuthenticated).toBe(true);
		});

		it('sets user from profile response', async () => {
			const profile = {
				_id: 'user-1',
				name: 'John',
				surname: 'Doe',
				email: 'john@test.com',
				role: 'admin'
			};
			registerEndpoint('/me', { method: 'GET', handler: () => profile });

			const { $auth } = useNuxtApp();
			$auth.state.value = { isAuthenticated: false, user: undefined };

			await $auth.authenticate();

			expect($auth.state.value.user).toEqual(profile);
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
					_id: 'user-1',
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

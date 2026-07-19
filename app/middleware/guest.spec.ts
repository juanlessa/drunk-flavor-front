import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockAuthenticate, mockAuthState } = vi.hoisted(() => {
	const mockAuthenticate = vi.fn();
	const mockAuthState = { value: { isAuthenticated: false, user: undefined } };
	(globalThis as any).defineNuxtRouteMiddleware = (fn: Function) => fn;
	(globalThis as any).useNuxtApp = () => ({
		$auth: { state: mockAuthState, authenticate: mockAuthenticate }
	});
	(globalThis as any).useLocalePath = () => (path: string) => path;
	(globalThis as any).navigateTo = (path: string) => ({ redirect: path });
	return { mockAuthenticate, mockAuthState };
});

import guestMiddleware from './guest';

describe('guest middleware', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockAuthState.value = { isAuthenticated: false, user: undefined };
	});

	it('does nothing when user is not authenticated', async () => {
		mockAuthenticate.mockResolvedValue(false);

		const result = await guestMiddleware({ path: '/login' } as any, {} as any);

		expect(result).toBeUndefined();
	});

	it('does nothing when authenticated user visits a non-login page', async () => {
		mockAuthState.value.isAuthenticated = true;

		const result = await guestMiddleware({ path: '/categories' } as any, {} as any);

		expect(result).toBeUndefined();
	});

	it('redirects to / when authenticated user visits /login', async () => {
		mockAuthState.value.isAuthenticated = true;

		const result = await guestMiddleware({ path: '/login' } as any, {} as any);

		expect(result).toEqual({ redirect: '/' });
	});

	it('attempts authentication when state says not authenticated', async () => {
		mockAuthenticate.mockResolvedValue(true);

		await guestMiddleware({ path: '/login' } as any, {} as any);

		expect(mockAuthenticate).toHaveBeenCalled();
	});

	it('redirects when authenticate succeeds and path is /login', async () => {
		mockAuthenticate.mockResolvedValue(true);

		const result = await guestMiddleware({ path: '/login' } as any, {} as any);

		expect(result).toEqual({ redirect: '/' });
	});

	it('does not redirect when authenticate fails', async () => {
		mockAuthenticate.mockResolvedValue(false);

		const result = await guestMiddleware({ path: '/login' } as any, {} as any);

		expect(result).toBeUndefined();
	});
});

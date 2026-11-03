import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { RouteLocationNormalized } from 'vue-router';
import guestMiddleware from './guest';

const { mockIsServerRuntime } = vi.hoisted(() => ({ mockIsServerRuntime: vi.fn() }));
vi.mock('~/helpers/runtime.helpers', () => ({ isServerRuntime: mockIsServerRuntime }));

const { mockAuthenticate, mockAuthState } = vi.hoisted(() => {
	const mockAuthenticate = vi.fn();
	const mockAuthState = { value: { isAuthenticated: false, user: undefined } };
	(globalThis as unknown as Record<string, unknown>).defineNuxtRouteMiddleware = (
		fn: (to: RouteLocationNormalized, from: RouteLocationNormalized) => unknown
	) => fn;
	(globalThis as unknown as Record<string, unknown>).useNuxtApp = () => ({
		$auth: { state: mockAuthState, authenticate: mockAuthenticate }
	});
	(globalThis as unknown as Record<string, unknown>).useLocalePath = () => (path: string) => path;
	(globalThis as unknown as Record<string, unknown>).navigateTo = (path: string) => ({
		redirect: path
	});
	return { mockAuthenticate, mockAuthState };
});

describe('guest middleware', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockIsServerRuntime.mockReturnValue(false);
		mockAuthState.value = { isAuthenticated: false, user: undefined };
	});

	it('does nothing when user is not authenticated', async () => {
		mockAuthenticate.mockResolvedValue(false);

		const result = await guestMiddleware(
			{ path: '/signin' } as RouteLocationNormalized,
			{} as RouteLocationNormalized
		);

		expect(result).toBeUndefined();
	});

	it('does nothing when authenticated user visits a non-signin page', async () => {
		mockAuthState.value.isAuthenticated = true;

		const result = await guestMiddleware(
			{ path: '/categories' } as RouteLocationNormalized,
			{} as RouteLocationNormalized
		);

		expect(result).toBeUndefined();
	});

	it('redirects to / when authenticated user visits /signin', async () => {
		mockAuthState.value.isAuthenticated = true;

		const result = await guestMiddleware(
			{ path: '/signin' } as RouteLocationNormalized,
			{} as RouteLocationNormalized
		);

		expect(result).toEqual({ redirect: '/' });
	});

	it('attempts authentication when state says not authenticated', async () => {
		mockAuthenticate.mockResolvedValue(true);

		await guestMiddleware(
			{ path: '/signin' } as RouteLocationNormalized,
			{} as RouteLocationNormalized
		);

		expect(mockAuthenticate).toHaveBeenCalled();
	});

	it('redirects when authenticate succeeds and path is /signin', async () => {
		mockAuthenticate.mockResolvedValue(true);

		const result = await guestMiddleware(
			{ path: '/signin' } as RouteLocationNormalized,
			{} as RouteLocationNormalized
		);

		expect(result).toEqual({ redirect: '/' });
	});

	it('redirects an incomplete profile to the complete-profile page', async () => {
		mockAuthState.value = {
			isAuthenticated: true,
			user: { status: 'incomplete_profile' } as never
		};

		const result = await guestMiddleware(
			{ path: '/' } as RouteLocationNormalized,
			{} as RouteLocationNormalized
		);

		expect(result).toEqual({ redirect: '/complete-profile' });
	});

	it('does not redirect when authenticate fails', async () => {
		mockAuthenticate.mockResolvedValue(false);

		const result = await guestMiddleware(
			{ path: '/signin' } as RouteLocationNormalized,
			{} as RouteLocationNormalized
		);

		expect(result).toBeUndefined();
	});

	describe('during server rendering', () => {
		beforeEach(() => {
			mockIsServerRuntime.mockReturnValue(true);
		});

		it('does not call the API to authenticate, since the session cookie never reaches the server', async () => {
			mockAuthenticate.mockResolvedValue(true);

			const result = await guestMiddleware(
				{ path: '/' } as RouteLocationNormalized,
				{} as RouteLocationNormalized
			);

			expect(mockAuthenticate).not.toHaveBeenCalled();
			expect(result).toBeUndefined();
		});

		it('leaves the guest state untouched so the payload carries no user', async () => {
			await guestMiddleware(
				{ path: '/' } as RouteLocationNormalized,
				{} as RouteLocationNormalized
			);

			expect(mockAuthState.value).toEqual({ isAuthenticated: false, user: undefined });
		});
	});
});

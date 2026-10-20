import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { RouteLocationNormalized } from 'vue-router';
import type { Profile } from '~/domain/profile/profile.entity';
import authMiddleware from './auth';

const { mockAuthenticate, mockAuthState } = vi.hoisted(() => {
	const mockAuthenticate = vi.fn();
	const mockAuthState = {
		value: { isAuthenticated: false, user: undefined as Profile | undefined }
	};
	(globalThis as unknown as Record<string, unknown>).defineNuxtRouteMiddleware = (
		fn: (to: RouteLocationNormalized, from: RouteLocationNormalized) => unknown
	) => fn;
	(globalThis as unknown as Record<string, unknown>).useNuxtApp = () => ({
		$auth: { state: mockAuthState, authenticate: mockAuthenticate }
	});
	(globalThis as unknown as Record<string, unknown>).navigateTo = (path: string) => ({
		redirect: path
	});
	return { mockAuthenticate, mockAuthState };
});

const buildProfile = (overrides: Partial<Profile>): Profile => ({
	_id: 'user-1',
	created_at: new Date(),
	updated_at: new Date(),
	name: 'Test',
	surname: 'User',
	email: 'test@example.com',
	role: 'member',
	...overrides
});

const route = (meta: Record<string, unknown> = {}) =>
	({ meta }) as unknown as RouteLocationNormalized;

describe('auth middleware', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockAuthState.value = { isAuthenticated: false, user: undefined };
	});

	it('does not redirect when already authenticated', async () => {
		mockAuthState.value.isAuthenticated = true;

		const result = await authMiddleware(route(), {} as RouteLocationNormalized);

		expect(mockAuthenticate).not.toHaveBeenCalled();
		expect(result).toBeUndefined();
	});

	it('attempts authentication when not authenticated', async () => {
		mockAuthenticate.mockResolvedValue(true);

		await authMiddleware(route(), {} as RouteLocationNormalized);

		expect(mockAuthenticate).toHaveBeenCalled();
	});

	it('does not redirect when authentication succeeds', async () => {
		mockAuthenticate.mockResolvedValue(true);

		const result = await authMiddleware(route(), {} as RouteLocationNormalized);

		expect(result).toBeUndefined();
	});

	it('redirects to / when authentication fails', async () => {
		mockAuthenticate.mockResolvedValue(false);

		const result = await authMiddleware(route(), {} as RouteLocationNormalized);

		expect(result).toEqual({ redirect: '/' });
	});

	it('does not redirect an authenticated user on a route without a can requirement', async () => {
		mockAuthState.value.isAuthenticated = true;
		mockAuthState.value.user = buildProfile({ role: 'member' });

		const result = await authMiddleware(route(), {} as RouteLocationNormalized);

		expect(result).toBeUndefined();
	});

	it('does not redirect when the user ability satisfies the route can requirement', async () => {
		mockAuthState.value.isAuthenticated = true;
		mockAuthState.value.user = buildProfile({ role: 'admin' });

		const result = await authMiddleware(
			route({ can: { action: 'manage', subject: 'User' } }),
			{} as RouteLocationNormalized
		);

		expect(result).toBeUndefined();
	});

	it('redirects to / when the user ability does not satisfy the route can requirement', async () => {
		mockAuthState.value.isAuthenticated = true;
		mockAuthState.value.user = buildProfile({ role: 'member' });

		const result = await authMiddleware(
			route({ can: { action: 'manage', subject: 'Drink' } }),
			{} as RouteLocationNormalized
		);

		expect(result).toEqual({ redirect: '/' });
	});
});

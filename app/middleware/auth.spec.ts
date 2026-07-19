import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { RouteLocationNormalized } from 'vue-router';
import authMiddleware from './auth';

const { mockAuthenticate, mockAuthState } = vi.hoisted(() => {
	const mockAuthenticate = vi.fn();
	const mockAuthState = { value: { isAuthenticated: false, user: undefined } };
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

describe('auth middleware', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockAuthState.value = { isAuthenticated: false, user: undefined };
	});

	it('does not redirect when already authenticated', async () => {
		mockAuthState.value.isAuthenticated = true;

		const result = await authMiddleware(
			{} as RouteLocationNormalized,
			{} as RouteLocationNormalized
		);

		expect(mockAuthenticate).not.toHaveBeenCalled();
		expect(result).toBeUndefined();
	});

	it('attempts authentication when not authenticated', async () => {
		mockAuthenticate.mockResolvedValue(true);

		await authMiddleware({} as RouteLocationNormalized, {} as RouteLocationNormalized);

		expect(mockAuthenticate).toHaveBeenCalled();
	});

	it('does not redirect when authentication succeeds', async () => {
		mockAuthenticate.mockResolvedValue(true);

		const result = await authMiddleware(
			{} as RouteLocationNormalized,
			{} as RouteLocationNormalized
		);

		expect(result).toBeUndefined();
	});

	it('redirects to / when authentication fails', async () => {
		mockAuthenticate.mockResolvedValue(false);

		const result = await authMiddleware(
			{} as RouteLocationNormalized,
			{} as RouteLocationNormalized
		);

		expect(result).toEqual({ redirect: '/' });
	});
});

import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockAuthenticate, mockAuthState } = vi.hoisted(() => {
	const mockAuthenticate = vi.fn();
	const mockAuthState = { value: { isAuthenticated: false, user: undefined } };
	(globalThis as any).defineNuxtRouteMiddleware = (fn: Function) => fn;
	(globalThis as any).useNuxtApp = () => ({
		$auth: { state: mockAuthState, authenticate: mockAuthenticate }
	});
	(globalThis as any).navigateTo = (path: string) => ({ redirect: path });
	return { mockAuthenticate, mockAuthState };
});

import authMiddleware from './auth';

describe('auth middleware', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockAuthState.value = { isAuthenticated: false, user: undefined };
	});

	it('does not redirect when already authenticated', async () => {
		mockAuthState.value.isAuthenticated = true;

		const result = await authMiddleware({} as any, {} as any);

		expect(mockAuthenticate).not.toHaveBeenCalled();
		expect(result).toBeUndefined();
	});

	it('attempts authentication when not authenticated', async () => {
		mockAuthenticate.mockResolvedValue(true);

		await authMiddleware({} as any, {} as any);

		expect(mockAuthenticate).toHaveBeenCalled();
	});

	it('does not redirect when authentication succeeds', async () => {
		mockAuthenticate.mockResolvedValue(true);

		const result = await authMiddleware({} as any, {} as any);

		expect(result).toBeUndefined();
	});

	it('redirects to / when authentication fails', async () => {
		mockAuthenticate.mockResolvedValue(false);

		const result = await authMiddleware({} as any, {} as any);

		expect(result).toEqual({ redirect: '/' });
	});
});

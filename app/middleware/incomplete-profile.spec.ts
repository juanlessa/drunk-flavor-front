import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { RouteLocationNormalized } from 'vue-router';
import incompleteProfileMiddleware from './incomplete-profile';

const { mockAuthState } = vi.hoisted(() => {
	const mockAuthState = { value: { isAuthenticated: true, user: undefined as unknown } };
	(globalThis as unknown as Record<string, unknown>).defineNuxtRouteMiddleware = (
		fn: (to: RouteLocationNormalized, from: RouteLocationNormalized) => unknown
	) => fn;
	(globalThis as unknown as Record<string, unknown>).useNuxtApp = () => ({
		$auth: { state: mockAuthState }
	});
	(globalThis as unknown as Record<string, unknown>).navigateTo = (path: string) => ({
		redirect: path
	});
	return { mockAuthState };
});

const run = () =>
	incompleteProfileMiddleware({} as RouteLocationNormalized, {} as RouteLocationNormalized);

describe('incomplete-profile middleware', () => {
	beforeEach(() => {
		mockAuthState.value = { isAuthenticated: true, user: undefined };
	});

	it('allows an incomplete profile to stay on the page', () => {
		mockAuthState.value.user = { status: 'incomplete_profile' };

		expect(run()).toBeUndefined();
	});

	it('sends a complete profile home', () => {
		mockAuthState.value.user = { status: 'active', name: 'Juan', surname: 'Lessa' };

		expect(run()).toEqual({ redirect: '/' });
	});
});

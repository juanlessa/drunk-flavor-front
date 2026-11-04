import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockNuxtImport, registerEndpoint } from '@nuxt/test-utils/runtime';
import { getRequestHeader } from 'h3';
import { readRequestLocale, resolveLocalePath } from './api-fetch';

const { reloadNuxtAppMock, navigateToMock } = vi.hoisted(() => ({
	reloadNuxtAppMock: vi.fn(),
	navigateToMock: vi.fn()
}));
mockNuxtImport('reloadNuxtApp', () => reloadNuxtAppMock);
mockNuxtImport('navigateTo', () => navigateToMock);

const receivedLanguages: (string | undefined)[] = [];

registerEndpoint('/users/locale-probe', {
	method: 'GET',
	handler: (event) => {
		receivedLanguages.push(getRequestHeader(event, 'accept-language'));
		return { id: 'locale-probe' };
	}
});

const registerErrorEndpoint = (id: string, code: string) => {
	registerEndpoint(`/users/${id}`, {
		method: 'GET',
		handler: () =>
			new Response(JSON.stringify({ ok: false, code }), {
				status: 401,
				headers: { 'content-type': 'application/json' }
			})
	});
};

registerErrorEndpoint('revoked', 'SESSION_REVOKED');
registerErrorEndpoint('incomplete', 'PROFILE_INCOMPLETE');
registerErrorEndpoint('unauthorized', 'UNAUTHORIZED');

describe('api-fetch plugin', () => {
	afterEach(async () => {
		receivedLanguages.length = 0;
		reloadNuxtAppMock.mockClear();
		navigateToMock.mockClear();
		await useNuxtApp().$i18n.setLocale('en');
	});

	it('asks the API to answer in the locale active when each request is sent', async () => {
		const { $api, $i18n } = useNuxtApp();

		await $api.users.get('locale-probe');
		await $i18n.setLocale('pt');
		await $api.users.get('locale-probe');

		expect(receivedLanguages).toEqual(['en', 'pt']);
	});

	it('reloads the app on the sign-in page when the session is revoked', async () => {
		const { $api } = useNuxtApp();

		await expect($api.users.get('revoked')).rejects.toBeDefined();

		expect(reloadNuxtAppMock).toHaveBeenCalledWith({ path: '/en/signin' });
	});

	it('keeps the Portuguese prefix when reloading on the sign-in page', async () => {
		const { $api, $i18n } = useNuxtApp();
		await $i18n.setLocale('pt');

		await expect($api.users.get('revoked')).rejects.toBeDefined();

		expect(reloadNuxtAppMock).toHaveBeenCalledWith({ path: '/pt/signin' });
	});

	it('sends an incomplete profile to the complete-profile page in the active language', async () => {
		const { $api, $i18n } = useNuxtApp();

		await expect($api.users.get('incomplete')).rejects.toBeDefined();
		await $i18n.setLocale('pt');
		await expect($api.users.get('incomplete')).rejects.toBeDefined();

		// `setLocale` also navigates (to the localized current route), so only the guard's calls count.
		const guardRedirects = navigateToMock.mock.calls
			.map(([path]) => String(path))
			.filter((path) => path.endsWith('/complete-profile'));
		expect(guardRedirects).toEqual(['/en/complete-profile', '/pt/complete-profile']);
	});

	it('does not reload the app for other unauthorized responses', async () => {
		const { $api } = useNuxtApp();

		await expect($api.users.get('unauthorized')).rejects.toBeDefined();

		expect(reloadNuxtAppMock).not.toHaveBeenCalled();
	});
});

describe('resolveLocalePath', () => {
	it('localizes the path with the i18n helper', () => {
		expect(resolveLocalePath((path: string) => `/pt${path}`, '/signin')).toBe('/pt/signin');
	});

	it('returns the path unchanged when i18n is not installed', () => {
		expect(resolveLocalePath(undefined, '/signin')).toBe('/signin');
	});
});

describe('readRequestLocale', () => {
	it('returns the active i18n locale', () => {
		expect(readRequestLocale({ locale: { value: 'pt' } })).toBe('pt');
	});

	it('returns undefined when i18n is not installed', () => {
		expect(readRequestLocale(undefined)).toBeUndefined();
	});
});

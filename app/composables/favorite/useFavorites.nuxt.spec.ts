import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockNuxtImport, registerEndpoint } from '@nuxt/test-utils/runtime';
import { createError } from 'h3';
import { useFavorites } from './useFavorites';
const { navigateToMock } = vi.hoisted(() => ({ navigateToMock: vi.fn() }));
mockNuxtImport('navigateTo', () => navigateToMock);
let ids: string[] = [];
let failing: Record<string, number | undefined> = {};
const received: Record<string, string[]> = { ids: [], add: [], remove: [] };
// Stays failing for the whole test: ofetch retries a failed GET once before rejecting.
const respond = <T>(key: string, value: T) => {
	const status = failing[key];
	if (status) throw createError({ statusCode: status });
	return value;
};
registerEndpoint('/me/favorites/ids', {
	method: 'GET',
	handler: () => {
		received.ids!.push('ids');
		return respond('ids', { drinkIds: ids });
	}
});
// registerEndpoint matches literal paths only, so each drink gets its own routes.
for (const id of ['d1', 'd2']) {
	registerEndpoint(`/me/favorites/${id}`, {
		method: 'PUT',
		handler: () => {
			received.add!.push(id);
			return respond('add', null);
		}
	});
	registerEndpoint(`/me/favorites/${id}`, {
		method: 'DELETE',
		handler: () => {
			received.remove!.push(id);
			return respond('remove', null);
		}
	});
}
const toastTitles = () => useToast().state.value.displayingToasts.map(({ title }) => title);
describe('useFavorites', () => {
	let favorites: ReturnType<typeof useFavorites>;
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => undefined);
		ids = ['d1'];
		failing = {};
		Object.values(received).forEach((list) => (list.length = 0));
		navigateToMock.mockReset();
		useToast().state.value.displayingToasts = [];
		useNuxtApp().$auth.state.value = { isAuthenticated: true, user: undefined };
		favorites = useFavorites();
		favorites.reset();
	});
	describe('load', () => {
		it('fills the ids once, however many times it is asked', async () => {
			expect(await favorites.load()).toBe(true);
			expect(await favorites.load()).toBe(true);
			expect(received.ids).toHaveLength(1);
			expect(favorites.state.value).toMatchObject({ ids: ['d1'], status: 'ready' });
			expect(favorites.isFavorite('d1')).toBe(true);
			expect(favorites.isFavorite('d2')).toBe(false);
		});
		it('says so when it fails, and can be asked again', async () => {
			failing.ids = 500;
			expect(await favorites.load()).toBe(false);
			expect(favorites.state.value.status).toBe('error');
			expect(toastTitles()).toEqual(['organisms.favorites.toast.errorTitle']);
			failing = {};
			expect(await favorites.load()).toBe(true);
			expect(favorites.state.value.status).toBe('ready');
		});
		it('is forgotten on reset', async () => {
			await favorites.load();
			favorites.reset();
			expect(favorites.state.value).toEqual({ ids: [], status: 'idle', pendingIds: [] });
		});
	});
	describe('add', () => {
		it('marks the drink before the answer arrives', async () => {
			const result = favorites.add('d2');
			expect(favorites.isFavorite('d2')).toBe(true);
			expect(favorites.isPending('d2')).toBe(true);
			expect(await result).toBe('added');
			expect(favorites.isPending('d2')).toBe(false);
			expect(received.add).toEqual(['d2']);
		});
		it('puts the heart back and tells why when the request fails', async () => {
			failing.add = 500;
			expect(await favorites.add('d2')).toBe('failed');
			expect(favorites.isFavorite('d2')).toBe(false);
			expect(toastTitles()).toEqual(['organisms.favorites.toast.errorTitle']);
		});
		it('says the limit was reached when the API answers a conflict', async () => {
			failing.add = 409;
			expect(await favorites.add('d2')).toBe('limit');
			expect(favorites.isFavorite('d2')).toBe(false);
			expect(toastTitles()).toEqual(['organisms.favorites.toast.limitTitle']);
		});
		it('ignores a second tap while the first is on its way', async () => {
			const first = favorites.add('d2');
			expect(await favorites.add('d2')).toBe('busy');
			await first;
			expect(received.add).toEqual(['d2']);
		});
	});
	describe('remove', () => {
		it('unmarks the drink before the answer arrives', async () => {
			await favorites.load();
			const result = favorites.remove('d1');
			expect(favorites.isFavorite('d1')).toBe(false);
			expect(await result).toBe('removed');
			expect(received.remove).toEqual(['d1']);
		});
		it('puts the heart back when the request fails', async () => {
			await favorites.load();
			failing.remove = 500;
			expect(await favorites.remove('d1')).toBe('failed');
			expect(favorites.isFavorite('d1')).toBe(true);
			expect(toastTitles()).toEqual(['organisms.favorites.toast.errorTitle']);
		});
	});
	describe('toggle', () => {
		it('saves a drink that is not a favorite and removes one that is', async () => {
			await favorites.load();
			expect(await favorites.toggle('d2')).toBe('added');
			expect(await favorites.toggle('d1')).toBe('removed');
			expect(favorites.state.value.ids).toEqual(['d2']);
		});
		it('sends a signed-out person to sign in, to come back and save the drink', async () => {
			useNuxtApp().$auth.state.value = { isAuthenticated: false, user: undefined };
			expect(await favorites.toggle('d2')).toBe('signin');
			expect(received.add).toEqual([]);
			expect(navigateToMock).toHaveBeenCalledTimes(1);
			const [target] = navigateToMock.mock.calls[0] as [
				{ path: string; query: { redirect: string; intent: string } }
			];
			expect(target.path).toMatch(/\/signin$/);
			expect(target.query.intent).toBe('favorite');
			expect(
				new URL(target.query.redirect, 'https://x.test').searchParams.get('favorite')
			).toBe('d2');
		});
	});
});

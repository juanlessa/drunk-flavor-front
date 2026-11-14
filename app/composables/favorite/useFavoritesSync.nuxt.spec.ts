import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockNuxtImport, registerEndpoint } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, reactive } from 'vue';
import { useFavoritesSync } from './useFavoritesSync';
// The address is the only thing the composable reads from the router, so it is controlled here.
const reactiveRoute = reactive({ query: {} as Record<string, string>, hash: '', fullPath: '/' });
mockNuxtImport('useRoute', () => () => reactiveRoute);
const received: Record<string, string[]> = { ids: [], add: [] };
registerEndpoint('/me/favorites/ids', {
	method: 'GET',
	handler: () => {
		received.ids!.push('ids');
		return { drinkIds: [] };
	}
});
registerEndpoint('/me/favorites/d1', {
	method: 'PUT',
	handler: () => {
		received.add!.push('d1');
		return null;
	}
});
const mountSync = () =>
	mount(
		defineComponent({
			setup() {
				useFavoritesSync();
				return () => h('div');
			}
		})
	);
const setSession = (isAuthenticated: boolean) => {
	useNuxtApp().$auth.state.value = { isAuthenticated, user: undefined };
};
const toastTitles = () => useToast().state.value.displayingToasts.map(({ title }) => title);
let replace: ReturnType<typeof vi.spyOn>;
describe('useFavoritesSync', () => {
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => undefined);
		Object.values(received).forEach((list) => (list.length = 0));
		replace = vi.spyOn(useRouter(), 'replace').mockImplementation(async (to) => {
			reactiveRoute.query = (to as { query: Record<string, string> }).query;
		});
		reactiveRoute.query = {};
		useToast().state.value.displayingToasts = [];
		setSession(false);
		useFavorites().reset();
	});
	it('loads the favorites when the person signs in and forgets them when they sign out', async () => {
		mountSync();
		await nextTick();
		expect(received.ids).toEqual([]);
		setSession(true);
		await vi.waitFor(() => expect(useFavorites().state.value.status).toBe('ready'));
		expect(received.ids).toHaveLength(1);
		setSession(false);
		await nextTick();
		expect(useFavorites().state.value.status).toBe('idle');
	});
	it('loads the favorites of a person who is already signed in when the app starts', async () => {
		setSession(true);
		mountSync();
		await vi.waitFor(() => expect(useFavorites().state.value.status).toBe('ready'));
	});
	it('saves the drink asked for before signing in, cleans the address and says so', async () => {
		setSession(true);
		reactiveRoute.query = { favorite: 'd1', q: 'gin' };
		mountSync();
		await vi.waitFor(() => expect(received.add).toEqual(['d1']));
		expect(replace).toHaveBeenCalledWith({ query: { q: 'gin' }, hash: '' });
		await vi.waitFor(() =>
			expect(toastTitles()).toEqual(['organisms.favorites.toast.resumedTitle'])
		);
	});
	it('waits for the person to be signed in before saving the drink', async () => {
		reactiveRoute.query = { favorite: 'd1' };
		mountSync();
		await nextTick();
		expect(received.add).toEqual([]);
		expect(replace).not.toHaveBeenCalled();
		setSession(true);
		await vi.waitFor(() => expect(received.add).toEqual(['d1']));
	});
	it('saves a drink asked for on a page that is already open', async () => {
		setSession(true);
		mountSync();
		reactiveRoute.query = { favorite: 'd1' };
		await vi.waitFor(() => expect(received.add).toEqual(['d1']));
	});
	it('ignores a value that is not a drink id', async () => {
		setSession(true);
		reactiveRoute.query = { favorite: '../../me' };
		mountSync();
		await nextTick();
		expect(received.add).toEqual([]);
		expect(replace).not.toHaveBeenCalled();
	});
});

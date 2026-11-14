import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockNuxtImport, registerEndpoint } from '@nuxt/test-utils/runtime';
import { createError, getQuery } from 'h3';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { FAVORITES_PAGE_SIZE } from '~/domain/favorite/favorite.constants';
import type { FavoriteWithDrink } from '~/domain/favorite/favorite.entity';
import type { FavoritesPage } from '~/domain/favorite/favorite.dtos';
import { useFavoritesList } from './useFavoritesList';
mockNuxtImport('navigateTo', () => vi.fn());
const buildItem = (id: string): FavoriteWithDrink =>
	({
		id,
		drinkId: `drink-${id}`,
		userId: 'user-1',
		createdAt: new Date(),
		drink: { id: `drink-${id}` }
	}) as unknown as FavoriteWithDrink;
let pages: Record<string, FavoritesPage> = {};
let failing = false;
const queries: Record<string, unknown>[] = [];
registerEndpoint('/me/favorites', {
	method: 'GET',
	handler: (event) => {
		const query = getQuery(event);
		queries.push(query);
		if (failing) throw createError({ statusCode: 500 });
		return pages[String(query.cursor ?? 'first')] ?? { items: [], nextCursor: null };
	}
});
// The list loads when its component mounts, so it is used the way a component uses it.
const mountList = async () => {
	let list!: ReturnType<typeof useFavoritesList>;
	mount(
		defineComponent({
			setup() {
				list = useFavoritesList();
				return () => h('div');
			}
		})
	);
	await vi.waitFor(() => expect(list.loading.value).toBe(false));
	await vi.waitFor(() => expect(list.hasLoaded.value || list.hasLoadError.value).toBe(true));
	return list;
};
describe('useFavoritesList', () => {
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => undefined);
		failing = false;
		queries.length = 0;
		pages = {
			first: { items: [buildItem('a'), buildItem('b')], nextCursor: 'cursor-1' },
			'cursor-1': { items: [buildItem('b'), buildItem('c')], nextCursor: null }
		};
	});
	it('loads the first page when it mounts, without a cursor', async () => {
		const list = await mountList();
		expect(queries).toEqual([{ limit: String(FAVORITES_PAGE_SIZE) }]);
		expect(list.items.value.map(({ id }) => id)).toEqual(['a', 'b']);
		expect(list.hasLoaded.value).toBe(true);
		expect(list.isLastPage.value).toBe(false);
	});
	it('asks the next page with the cursor it was given and skips what is already listed', async () => {
		const list = await mountList();
		list.loadMore();
		await vi.waitFor(() => expect(list.isLastPage.value).toBe(true));
		expect(queries[1]).toEqual({ limit: String(FAVORITES_PAGE_SIZE), cursor: 'cursor-1' });
		expect(list.items.value.map(({ id }) => id)).toEqual(['a', 'b', 'c']);
		expect(list.isLastPage.value).toBe(true);
	});
	it('stops asking after the last page', async () => {
		const list = await mountList();
		list.loadMore();
		await vi.waitFor(() => expect(list.isLastPage.value).toBe(true));
		list.loadMore();
		expect(list.loading.value).toBe(false);
		expect(queries).toHaveLength(2);
	});
	it('flags a first page that failed, and starts over when asked again', async () => {
		failing = true;
		const list = await mountList();
		expect(list.hasLoadError.value).toBe(true);
		expect(list.hasLoaded.value).toBe(false);
		failing = false;
		await list.load();
		expect(list.hasLoadError.value).toBe(false);
		expect(list.items.value).toHaveLength(2);
	});
});

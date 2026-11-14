import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { computed, ref } from 'vue';
import type { FavoriteWithDrink } from '~/domain/favorite/favorite.entity';
import FavoritesList from './FavoritesList.vue';
const items = ref<FavoriteWithDrink[]>([]);
const loading = ref(false);
const hasLoaded = ref(true);
const hasLoadError = ref(false);
const isLastPage = ref(true);
const load = vi.fn();
const loadMore = vi.fn();
vi.stubGlobal('useFavoritesList', () => ({
	items: computed(() => items.value),
	loading,
	hasLoaded,
	hasLoadError,
	isLastPage,
	load,
	loadMore
}));
// jsdom-like environments have no IntersectionObserver; the sentinel is covered through its button.
vi.stubGlobal(
	'IntersectionObserver',
	class {
		observe = vi.fn();
		unobserve = vi.fn();
		disconnect = vi.fn();
	}
);
const item = (id: string) =>
	({ id, drinkId: `drink-${id}`, drink: { id: `drink-${id}` } }) as never;
const mountList = () =>
	mount(FavoritesList, {
		global: {
			stubs: {
				FavoritesGridSkeleton: { template: '<div data-testid="skeleton" />' },
				FavoritesEmpty: { template: '<div data-testid="empty" />' },
				DrinkCard: { props: ['drink'], template: '<article data-testid="card" />' },
				Button: { template: '<button type="button"><slot /></button>' }
			},
			mocks: { $t: (key: string) => key }
		}
	});
describe('FavoritesList', () => {
	beforeEach(() => {
		items.value = [];
		loading.value = false;
		hasLoaded.value = true;
		hasLoadError.value = false;
		isLastPage.value = true;
		load.mockReset();
		loadMore.mockReset();
	});
	it('shows the skeleton until the first page arrives', () => {
		hasLoaded.value = false;
		const wrapper = mountList();
		expect(wrapper.find('[data-testid="skeleton"]').exists()).toBe(true);
		expect(wrapper.find('[data-testid="card"]').exists()).toBe(false);
	});
	it('offers to try again when the first page fails', async () => {
		hasLoaded.value = false;
		hasLoadError.value = true;
		const wrapper = mountList();
		expect(wrapper.find('[role="alert"]').exists()).toBe(true);
		await wrapper.get('button').trigger('click');
		expect(load).toHaveBeenCalledTimes(1);
	});
	it('says there are no favorites when the first page is empty', () => {
		expect(mountList().find('[data-testid="empty"]').exists()).toBe(true);
	});
	it('lists a card for every favorite', () => {
		items.value = [item('a'), item('b')];
		expect(mountList().findAll('[data-testid="card"]')).toHaveLength(2);
	});
	it('offers the next page only while there is one, and asks for it with the button', async () => {
		items.value = [item('a')];
		expect(mountList().find('button').exists()).toBe(false);
		isLastPage.value = false;
		const wrapper = mountList();
		await wrapper.get('button').trigger('click');
		expect(loadMore).toHaveBeenCalledTimes(1);
	});
});

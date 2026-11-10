import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime';
import { getQuery } from 'h3';
import type { Drink } from '~/domain/drink/drink.entity';
import { useDrinksOverview } from './useDrinksOverview';

const buildDrink = (id: string) => ({ id }) as Drink;

let pages: Record<string, Drink[]> = {};
let isFailing = false;
const receivedPages: string[] = [];
type ReceivedRequest = { page: string; search?: unknown; sort?: unknown };
const receivedRequests: ReceivedRequest[] = [];
const parseJson = (value: unknown) =>
	typeof value === 'string' ? (JSON.parse(value) as unknown) : undefined;
/** Pages by search term; a term without an entry gets the default pages. */
let pagesBySearch: Record<string, Record<string, Drink[]>> = {};
registerEndpoint('/drinks', {
	method: 'GET',
	handler: (event) => {
		const query = getQuery(event);
		const page = String(query.page);
		const search = parseJson(query.search) as { name?: string } | undefined;
		receivedPages.push(page);
		receivedRequests.push({ page, search, sort: parseJson(query.sort) });
		// Stays failing for the whole test: ofetch retries a failed GET once before rejecting.
		if (isFailing) throw new Error('list failed');
		const source =
			(search?.name !== undefined ? pagesBySearch[search.name] : undefined) ?? pages;
		return source[page] ?? [];
	}
});
type Overview = Awaited<ReturnType<typeof useDrinksOverview>>;

/** The composable awaits its first page and hooks into unmount, so it needs a component around it. */
const mountOverview = async (route = '/') => {
	let overview: Overview | undefined;
	const wrapper = await mountSuspended(
		defineComponent({
			async setup() {
				overview = await useDrinksOverview();
				return () => h('div');
			}
		}),
		{ route }
	);
	if (!overview) throw new Error('useDrinksOverview did not resolve');
	return { wrapper, overview };
};

const nameField = () => `translations.${useNuxtApp().$i18n.locale.value}.name`;
const lastRequest = () => receivedRequests[receivedRequests.length - 1];
const drinkIds = (overview: Overview) => overview.overviewState.value.drinks.map(({ id }) => id);

describe('useDrinksOverview', () => {
	let unmount: (() => void) | undefined;

	beforeEach(() => {
		pages = {
			'1': [buildDrink('a1'), buildDrink('a2')],
			'2': [buildDrink('b1')]
		};
		pagesBySearch = {};
		isFailing = false;
		receivedPages.length = 0;
		receivedRequests.length = 0;
		useState('drinksOverview').value = undefined;
		useState('toastNotification').value = undefined;
	});

	afterEach(async () => {
		unmount?.();
		unmount = undefined;
		vi.restoreAllMocks();
		await navigateTo('/');
	});

	it('resolves with the first page already loaded', async () => {
		const { wrapper, overview } = await mountOverview();
		unmount = () => wrapper.unmount();

		// No waiting: the first page must be there as soon as setup resolves, which is what lets the
		// server render it. A lazy or client-only fetch would leave the list empty at this point.
		expect(drinkIds(overview)).toEqual(['a1', 'a2']);
		expect(receivedPages).toEqual(['1']);
		expect(overview.overviewState.value.filter).toMatchObject({ page: 1, isLastPage: false });
	});

	it('appends the next page to the loaded drinks', async () => {
		const { wrapper, overview } = await mountOverview();
		unmount = () => wrapper.unmount();
		await vi.waitFor(() => expect(drinkIds(overview)).toHaveLength(2));

		overview.loadNextPage();

		await vi.waitFor(() => expect(drinkIds(overview)).toEqual(['a1', 'a2', 'b1']));
		expect(overview.overviewState.value.filter.page).toBe(2);
	});

	it('marks the last page when a page comes back empty and stops asking for more', async () => {
		pages = { '1': [buildDrink('a1')] };
		const { wrapper, overview } = await mountOverview();
		unmount = () => wrapper.unmount();
		await vi.waitFor(() => expect(drinkIds(overview)).toHaveLength(1));

		overview.loadNextPage();
		await vi.waitFor(() => expect(overview.overviewState.value.filter.isLastPage).toBe(true));

		overview.loadNextPage();
		expect(overview.overviewState.value.filter.page).toBe(2);
		expect(drinkIds(overview)).toEqual(['a1']);
	});

	it('does not request another page while one is still loading', async () => {
		const { wrapper, overview } = await mountOverview();
		unmount = () => wrapper.unmount();
		await vi.waitFor(() => expect(drinkIds(overview)).toHaveLength(2));

		overview.overviewState.value.loading = true;
		overview.loadNextPage();

		expect(overview.overviewState.value.filter.page).toBe(1);
	});

	it('warns the user when the list cannot be loaded', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		isFailing = true;
		const { wrapper, overview } = await mountOverview();
		unmount = () => wrapper.unmount();

		// A failing first page resolves without drinks, so the page can still render its shell.
		expect(drinkIds(overview)).toEqual([]);

		overview.loadNextPage();

		await vi.waitFor(() =>
			expect(useToast().state.value.displayingToasts).toContainEqual(
				expect.objectContaining({
					type: 'error',
					title: 'organisms.drinksOverview.errorTitle',
					message: 'organisms.drinksOverview.errorMessage'
				})
			)
		);
	});

	it('starts over from the first page after the component unmounts', async () => {
		const { wrapper, overview } = await mountOverview();
		await vi.waitFor(() => expect(drinkIds(overview)).toHaveLength(2));

		wrapper.unmount();

		expect(overview.overviewState.value).toMatchObject({
			drinks: [],
			filter: { page: 1, isLastPage: false },
			loading: false
		});
	});

	describe('search and order', () => {
		it('asks for the best rated first, with no search, on the first visit', async () => {
			const { wrapper, overview } = await mountOverview();
			unmount = () => wrapper.unmount();
			expect(receivedRequests[0]).toEqual({
				page: '1',
				search: undefined,
				sort: { ratingScore: 'desc', [nameField()]: 'asc' }
			});
			expect(overview.sort.value).toBe('rating');
			expect(overview.searchTerm.value).toBe('');
		});

		it('takes the search and the order from the URL before the first request', async () => {
			const { wrapper, overview } = await mountOverview('/?q=gin&sort=name');
			unmount = () => wrapper.unmount();
			expect(receivedRequests).toEqual([
				{ page: '1', search: { name: 'gin' }, sort: { [nameField()]: 'asc' } }
			]);
			expect(overview.searchTerm.value).toBe('gin');
			expect(overview.sort.value).toBe('name');
		});

		it('ignores an order the list does not have in the URL', async () => {
			const { wrapper, overview } = await mountOverview('/?sort=price');
			unmount = () => wrapper.unmount();
			expect(overview.sort.value).toBe('rating');
		});

		it('starts the list over with the typed search after a pause, and keeps it in the URL', async () => {
			pagesBySearch = { rum: { '1': [buildDrink('r1')] } };
			const { wrapper, overview } = await mountOverview();
			unmount = () => wrapper.unmount();
			await vi.waitFor(() => expect(drinkIds(overview)).toEqual(['a1', 'a2']));
			overview.searchTerm.value = 'rum';
			// Nothing is asked while the person is still typing.
			expect(receivedRequests).toHaveLength(1);
			await vi.waitFor(() => expect(drinkIds(overview)).toEqual(['r1']));
			expect(lastRequest()).toMatchObject({ page: '1', search: { name: 'rum' } });
			expect(overview.overviewState.value.filter.page).toBe(1);
			await vi.waitFor(() => expect(useRoute().query.q).toBe('rum'));
		});

		it('asks once for a term typed in several keystrokes', async () => {
			const { wrapper, overview } = await mountOverview();
			unmount = () => wrapper.unmount();
			overview.searchTerm.value = 'r';
			overview.searchTerm.value = 'ru';
			overview.searchTerm.value = 'rum';
			await vi.waitFor(() => expect(receivedRequests).toHaveLength(2));
			await new Promise((resolve) => setTimeout(resolve, 500));
			expect(receivedRequests).toHaveLength(2);
			expect(lastRequest()?.search).toEqual({ name: 'rum' });
		});

		it('does not ask again when only the spaces around the term change', async () => {
			const { wrapper, overview } = await mountOverview();
			unmount = () => wrapper.unmount();
			overview.searchTerm.value = 'rum';
			await vi.waitFor(() => expect(receivedRequests).toHaveLength(2));
			overview.searchTerm.value = 'rum  ';
			await new Promise((resolve) => setTimeout(resolve, 500));
			expect(receivedRequests).toHaveLength(2);
		});

		it('searches again from the first page, not from the page it was on', async () => {
			const { wrapper, overview } = await mountOverview();
			unmount = () => wrapper.unmount();
			await vi.waitFor(() => expect(drinkIds(overview)).toHaveLength(2));
			overview.loadNextPage();
			await vi.waitFor(() => expect(drinkIds(overview)).toHaveLength(3));
			overview.searchTerm.value = 'gin';
			await vi.waitFor(() =>
				expect(lastRequest()).toMatchObject({ page: '1', search: { name: 'gin' } })
			);
			expect(overview.overviewState.value.filter.isLastPage).toBe(false);
		});

		it('starts the list over in the new order at once, and keeps a non default order in the URL', async () => {
			const { wrapper, overview } = await mountOverview();
			unmount = () => wrapper.unmount();
			await vi.waitFor(() => expect(drinkIds(overview)).toHaveLength(2));
			overview.sort.value = 'recent';
			await vi.waitFor(() =>
				expect(lastRequest()).toMatchObject({ page: '1', sort: { createdAt: 'desc' } })
			);
			expect(useRoute().query.sort).toBe('recent');
			overview.sort.value = 'rating';
			await vi.waitFor(() => expect(useRoute().query.sort).toBeUndefined());
		});

		it('keeps the search when the order changes, and the order when the search changes', async () => {
			const { wrapper, overview } = await mountOverview();
			unmount = () => wrapper.unmount();
			overview.searchTerm.value = 'gin';
			await vi.waitFor(() => expect(lastRequest()?.search).toEqual({ name: 'gin' }));
			overview.sort.value = 'name';
			await vi.waitFor(() =>
				expect(lastRequest()).toMatchObject({
					search: { name: 'gin' },
					sort: { [nameField()]: 'asc' }
				})
			);
			overview.searchTerm.value = 'rum';
			await vi.waitFor(() =>
				expect(lastRequest()).toMatchObject({
					search: { name: 'rum' },
					sort: { [nameField()]: 'asc' }
				})
			);
		});

		it('does not ask again when the same order is picked', async () => {
			const { wrapper, overview } = await mountOverview();
			unmount = () => wrapper.unmount();
			overview.sort.value = 'rating';
			await new Promise((resolve) => setTimeout(resolve, 100));
			expect(receivedRequests).toHaveLength(1);
		});

		it('says the search found nothing once the first page comes back empty', async () => {
			pagesBySearch = { zzz: {} };
			const { wrapper, overview } = await mountOverview();
			unmount = () => wrapper.unmount();
			expect(overview.isEmpty.value).toBe(false);
			overview.searchTerm.value = 'zzz';
			await vi.waitFor(() => expect(overview.isEmpty.value).toBe(true));
			expect(overview.isSearching.value).toBe(true);
			expect(drinkIds(overview)).toEqual([]);
		});

		it('is not empty while it loads or when it has drinks', async () => {
			const { wrapper, overview } = await mountOverview();
			unmount = () => wrapper.unmount();
			expect(overview.isEmpty.value).toBe(false);
			expect(overview.isSearching.value).toBe(false);
		});

		it('follows the URL when it changes by itself, for example from a link', async () => {
			pagesBySearch = { rum: { '1': [buildDrink('r1')] } };
			const { wrapper, overview } = await mountOverview();
			unmount = () => wrapper.unmount();
			await vi.waitFor(() => expect(drinkIds(overview)).toHaveLength(2));
			await navigateTo({ path: '/', query: { q: 'rum' } });
			await vi.waitFor(() => expect(drinkIds(overview)).toEqual(['r1']));
			expect(overview.searchTerm.value).toBe('rum');
			await navigateTo('/');
			await vi.waitFor(() => expect(drinkIds(overview)).toEqual(['a1', 'a2']));
			expect(overview.searchTerm.value).toBe('');
		});

		it('keeps the other parameters of the URL', async () => {
			const { wrapper, overview } = await mountOverview('/?utm=newsletter');
			unmount = () => wrapper.unmount();
			overview.sort.value = 'name';
			await vi.waitFor(() =>
				expect(useRoute().query).toEqual({ utm: 'newsletter', sort: 'name' })
			);
		});

		it('cuts a term longer than the API accepts', async () => {
			const { wrapper, overview } = await mountOverview();
			unmount = () => wrapper.unmount();
			overview.searchTerm.value = 'a'.repeat(100);
			await vi.waitFor(() =>
				expect((lastRequest()?.search as { name: string } | undefined)?.name).toHaveLength(
					64
				)
			);
		});

		it('forgets the search and the order after the component unmounts', async () => {
			const { wrapper, overview } = await mountOverview();
			overview.sort.value = 'name';
			overview.searchTerm.value = 'gin';
			wrapper.unmount();
			expect(overview.overviewState.value).toMatchObject({ searchTerm: '', sort: 'rating' });
		});
	});
});

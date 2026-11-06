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

registerEndpoint('/drinks', {
	method: 'GET',
	handler: (event) => {
		const page = String(getQuery(event).page);
		receivedPages.push(page);
		// Stays failing for the whole test: ofetch retries a failed GET once before rejecting.
		if (isFailing) throw new Error('list failed');
		return pages[page] ?? [];
	}
});

type Overview = Awaited<ReturnType<typeof useDrinksOverview>>;

/** The composable awaits its first page and hooks into unmount, so it needs a component around it. */
const mountOverview = async () => {
	let overview: Overview | undefined;
	const wrapper = await mountSuspended(
		defineComponent({
			async setup() {
				overview = await useDrinksOverview();
				return () => h('div');
			}
		})
	);
	if (!overview) throw new Error('useDrinksOverview did not resolve');
	return { wrapper, overview };
};

const drinkIds = (overview: Overview) => overview.overviewState.value.drinks.map(({ id }) => id);

describe('useDrinksOverview', () => {
	let unmount: (() => void) | undefined;

	beforeEach(() => {
		pages = {
			'1': [buildDrink('a1'), buildDrink('a2')],
			'2': [buildDrink('b1')]
		};
		isFailing = false;
		receivedPages.length = 0;
		useState('drinksOverview').value = undefined;
		useState('toastNotification').value = undefined;
	});

	afterEach(() => {
		unmount?.();
		unmount = undefined;
		vi.restoreAllMocks();
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
});

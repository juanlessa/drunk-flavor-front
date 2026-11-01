import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { registerEndpoint } from '@nuxt/test-utils/runtime';
import { getQuery, readBody } from 'h3';
import type { Drink } from '~/domain/drink/drink.entity';
import { useDrinksControlOverview } from './controlOverview';

const receivedQueries: Record<string, unknown>[] = [];
const deletedIds: string[] = [];

registerEndpoint('/drinks', {
	method: 'GET',
	handler: (event) => {
		receivedQueries.push(getQuery(event));
		return [];
	}
});
registerEndpoint('/drinks', {
	method: 'DELETE',
	handler: async (event) => {
		const body = (await readBody(event)) as { id: string };
		deletedIds.push(body.id);
		return null;
	}
});

describe('useDrinksControlOverview', () => {
	let overview: ReturnType<typeof useDrinksControlOverview>;

	beforeEach(() => {
		receivedQueries.length = 0;
		deletedIds.length = 0;
		overview = useDrinksControlOverview();
		overview.resetOverviewState();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('starts on the first page sorted by the localized name', () => {
		expect(overview.overviewState.value.drinks).toEqual([]);
		expect(overview.overviewState.value.filter).toMatchObject({
			page: 1,
			limit: 30,
			isLastPage: false,
			sort: { 'translations.en.name': 1 }
		});
		expect(overview.overviewState.value.filter.search).toBeUndefined();
	});

	it('does not share state with the public drinks overview', () => {
		overview.overviewState.value.filter.page = 4;

		expect(useState('drinksOverview').value).toBeUndefined();
	});

	it('loads the next page unless loading or already on the last page', () => {
		overview.loadNextPage();
		expect(overview.overviewState.value.filter.page).toBe(2);

		overview.overviewState.value.loading = true;
		overview.loadNextPage();
		expect(overview.overviewState.value.filter.page).toBe(2);

		overview.overviewState.value.loading = false;
		overview.overviewState.value.filter.isLastPage = true;
		overview.loadNextPage();
		expect(overview.overviewState.value.filter.page).toBe(2);
	});

	it('restarts the list with a name search after the debounce', async () => {
		vi.useFakeTimers();
		overview.overviewState.value.filter.page = 3;

		overview.searchTerm.value = '  moj  ';
		await vi.advanceTimersByTimeAsync(300);

		expect(overview.overviewState.value.filter).toMatchObject({
			page: 1,
			search: { 'translations.en.name': 'moj' }
		});
		await vi.waitFor(() =>
			expect(receivedQueries).toContainEqual(
				expect.objectContaining({
					page: '1',
					search: JSON.stringify({ 'translations.en.name': 'moj' })
				})
			)
		);
	});

	it('clears the search filter when the term is emptied', async () => {
		vi.useFakeTimers();
		overview.searchTerm.value = 'moj';
		await vi.advanceTimersByTimeAsync(300);

		overview.searchTerm.value = '';
		await vi.advanceTimersByTimeAsync(300);

		expect(overview.overviewState.value.filter.search).toBeUndefined();
	});

	it('marks the last page and reports an empty list when a page comes back short', async () => {
		overview.loadNextPage();

		await vi.waitFor(() => expect(overview.overviewState.value.filter.isLastPage).toBe(true));
		await vi.waitFor(() => expect(overview.isEmpty.value).toBe(true));
	});

	it('removes the deleted drink from the loaded list', async () => {
		overview.overviewState.value.drinks = [{ id: 'drink-1' }, { id: 'drink-2' }] as Drink[];

		await overview.deleteDrink('drink-1');

		expect(deletedIds).toEqual(['drink-1']);
		expect(overview.overviewState.value.drinks.map(({ id }) => id)).toEqual(['drink-2']);
	});
});

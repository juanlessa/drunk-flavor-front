import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { registerEndpoint } from '@nuxt/test-utils/runtime';
import { getQuery, readBody } from 'h3';
import type { Unit } from '~/domain/unit/unit.entity';
import { useUnitsOverview } from './useUnitsOverview';

const receivedQueries: Record<string, unknown>[] = [];
const deletedIds: string[] = [];

registerEndpoint('/units', {
	method: 'GET',
	handler: (event) => {
		receivedQueries.push(getQuery(event));
		return [];
	}
});
registerEndpoint('/units', {
	method: 'DELETE',
	handler: async (event) => {
		const body = (await readBody(event)) as { id: string };
		deletedIds.push(body.id);
		return null;
	}
});

describe('useUnitsOverview', () => {
	let overview: ReturnType<typeof useUnitsOverview>;

	beforeEach(() => {
		receivedQueries.length = 0;
		deletedIds.length = 0;
		overview = useUnitsOverview();
		overview.resetOverviewState();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('starts on the first page sorted by the localized name', () => {
		expect(overview.overviewState.value.units).toEqual([]);
		expect(overview.overviewState.value.filter).toMatchObject({
			page: 1,
			limit: 30,
			isLastPage: false,
			sort: { 'translations.en.name': 1 }
		});
		expect(overview.overviewState.value.filter.search).toBeUndefined();
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

		overview.searchTerm.value = '  gram  ';
		await vi.advanceTimersByTimeAsync(300);

		expect(overview.overviewState.value.filter).toMatchObject({
			page: 1,
			search: { 'translations.en.name': 'gram' }
		});
		await vi.waitFor(() =>
			expect(receivedQueries).toContainEqual(
				expect.objectContaining({
					page: '1',
					search: JSON.stringify({ 'translations.en.name': 'gram' })
				})
			)
		);
	});

	it('clears the search filter when the term is emptied', async () => {
		vi.useFakeTimers();
		overview.searchTerm.value = 'gram';
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

	it('removes the deleted unit from the loaded list', async () => {
		overview.overviewState.value.units = [{ id: 'unit-1' }, { id: 'unit-2' }] as Unit[];

		await overview.deleteUnit('unit-1');

		expect(deletedIds).toEqual(['unit-1']);
		expect(overview.overviewState.value.units.map(({ id }) => id)).toEqual(['unit-2']);
	});
});

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { registerEndpoint } from '@nuxt/test-utils/runtime';
import { getQuery } from 'h3';
import { useUsersOverview } from './overview';

const receivedQueries: Record<string, unknown>[] = [];

registerEndpoint('/users', {
	method: 'GET',
	handler: (event) => {
		receivedQueries.push(getQuery(event));
		return [];
	}
});

describe('useUsersOverview', () => {
	let overview: ReturnType<typeof useUsersOverview>;

	beforeEach(() => {
		receivedQueries.length = 0;
		overview = useUsersOverview();
		overview.resetOverviewState();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('starts on the first page sorted by email', () => {
		expect(overview.overviewState.value.filter).toMatchObject({
			page: 1,
			limit: 30,
			isLastPage: false,
			sort: { email: 1 }
		});
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

	it('restarts the list with an email search after the debounce', async () => {
		vi.useFakeTimers();
		overview.overviewState.value.filter.page = 3;

		overview.searchTerm.value = '  ana  ';
		await vi.advanceTimersByTimeAsync(300);

		expect(overview.overviewState.value.filter).toMatchObject({
			page: 1,
			search: { email: 'ana' }
		});
		await vi.waitFor(() =>
			expect(receivedQueries).toContainEqual(
				expect.objectContaining({ page: '1', search: JSON.stringify({ email: 'ana' }) })
			)
		);
	});

	it('clears the search filter when the term is emptied', async () => {
		vi.useFakeTimers();
		overview.searchTerm.value = 'ana';
		await vi.advanceTimersByTimeAsync(300);

		overview.searchTerm.value = '';
		await vi.advanceTimersByTimeAsync(300);

		expect(overview.overviewState.value.filter.search).toBeUndefined();
	});
});

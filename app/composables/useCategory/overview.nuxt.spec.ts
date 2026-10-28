import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerEndpoint } from '@nuxt/test-utils/runtime';
import { useCategoriesOverview } from './overview';

registerEndpoint('/categories', {
	method: 'GET',
	handler: () => []
});

registerEndpoint('/categories', {
	method: 'DELETE',
	handler: () => ({})
});

describe('useCategoriesOverview', () => {
	let overview: ReturnType<typeof useCategoriesOverview>;

	beforeEach(() => {
		vi.spyOn(console, 'warn').mockImplementation(() => {});
		overview = useCategoriesOverview();
		overview.resetOverviewState();
	});

	describe('initial state', () => {
		it('starts with empty categories', () => {
			expect(overview.overviewState.value.categories).toEqual([]);
		});

		it('starts at page 1 with limit 30', () => {
			expect(overview.overviewState.value.filter.page).toBe(1);
			expect(overview.overviewState.value.filter.limit).toBe(30);
		});

		it('starts with isLastPage false', () => {
			expect(overview.overviewState.value.filter.isLastPage).toBe(false);
		});

		it('starts with loading false', () => {
			expect(overview.overviewState.value.loading).toBe(false);
		});
	});

	describe('loadNextPage', () => {
		it('increments page number', () => {
			overview.loadNextPage();

			expect(overview.overviewState.value.filter.page).toBe(2);
		});

		it('does not increment when loading is true', () => {
			overview.overviewState.value.loading = true;

			overview.loadNextPage();

			expect(overview.overviewState.value.filter.page).toBe(1);
		});

		it('does not increment when isLastPage is true', () => {
			overview.overviewState.value.filter.isLastPage = true;

			overview.loadNextPage();

			expect(overview.overviewState.value.filter.page).toBe(1);
		});
	});

	describe('deleteCategory', () => {
		it('resolves without error', async () => {
			await expect(overview.deleteCategory('cat-1')).resolves.not.toThrow();
		});
	});

	describe('resetOverviewState', () => {
		it('resets state to initial values', () => {
			overview.overviewState.value.categories = [
				{
					id: 'cat-1',
					translations: { en: { name: 'A' }, pt: { name: 'B' } },
					isAlcoholic: false,
					createdAt: new Date(),
					updatedAt: new Date()
				}
			];
			overview.overviewState.value.filter.page = 3;
			overview.overviewState.value.filter.isLastPage = true;

			overview.resetOverviewState();

			expect(overview.overviewState.value.categories).toEqual([]);
			expect(overview.overviewState.value.filter.page).toBe(1);
			expect(overview.overviewState.value.filter.isLastPage).toBe(false);
		});
	});
});

import { describe, expect, it, vi } from 'vitest';
import type { $Fetch } from 'nitropack';
import { categoriesRepository } from '../category/category.repository';
import { drinksRepository } from '../drink/drink.repository';
import { ingredientsRepository } from '../ingredient/ingredient.repository';
import { unitsRepository } from '../unit/unit.repository';

const catalog = [
	['categories', categoriesRepository],
	['units', unitsRepository],
	['ingredients', ingredientsRepository],
	['drinks', drinksRepository]
] as const;

describe.each(catalog)('the reads with authorship of /%s', (collection, repository) => {
	it('lists from /me with the search and the sort as JSON and the paging as numbers', async () => {
		const records = [{ id: '1', createdBy: 'user-1', updatedBy: 'user-2' }];
		const fetchMock = vi.fn().mockResolvedValue(records);

		const result = await repository(fetchMock as unknown as $Fetch).listWithAuthorship({
			page: 2,
			limit: 30,
			search: { name: 'gin' },
			sort: { 'translations.pt.name': 'asc' }
		});

		expect(result).toBe(records);
		expect(fetchMock).toHaveBeenCalledWith(`/${collection}/me`, {
			query: {
				page: 2,
				limit: 30,
				search: JSON.stringify({ name: 'gin' }),
				sort: JSON.stringify({ 'translations.pt.name': 'asc' })
			}
		});
	});

	it('leaves the search and the sort out of the query when there are none', async () => {
		const fetchMock = vi.fn().mockResolvedValue([]);

		await repository(fetchMock as unknown as $Fetch).listWithAuthorship({ page: 1, limit: 10 });

		expect(fetchMock).toHaveBeenCalledWith(`/${collection}/me`, {
			query: { page: 1, limit: 10 }
		});
	});

	it('gets one record from /me/:id', async () => {
		const record = { id: 'abc', createdBy: 'user-1' };
		const fetchMock = vi.fn().mockResolvedValue(record);

		const result = await repository(fetchMock as unknown as $Fetch).getWithAuthorship('abc');

		expect(result).toBe(record);
		expect(fetchMock.mock.calls[0]?.[0]).toBe(`/${collection}/me/abc`);
	});

	it('keeps the public reads on the public paths', async () => {
		const fetchMock = vi.fn().mockResolvedValue([]);

		await repository(fetchMock as unknown as $Fetch).list({ page: 1, limit: 10 });
		await repository(fetchMock as unknown as $Fetch).get('abc');

		expect(fetchMock.mock.calls.map(([path]) => path)).toEqual([
			`/${collection}`,
			`/${collection}/abc`
		]);
	});
});

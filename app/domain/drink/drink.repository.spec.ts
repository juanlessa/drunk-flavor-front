import { describe, expect, it, vi } from 'vitest';
import type { $Fetch } from 'nitropack';
import { drinksRepository } from './drink.repository';

describe('drinksRepository.match', () => {
	it('sends the ingredients as a JSON body with the QUERY method and the page in the querystring', async () => {
		const response = { items: [] };
		const fetchMock = vi.fn().mockResolvedValue(response);
		const { signal } = new AbortController();

		const result = await drinksRepository(fetchMock as unknown as $Fetch).match(
			{ ingredientIds: ['gin', 'lime'], maxMissing: 'any' },
			{ page: 2, limit: 20 },
			{ signal }
		);

		expect(result).toBe(response);
		expect(fetchMock).toHaveBeenCalledWith('/drinks/match', {
			method: 'QUERY',
			query: { page: 2, limit: 20 },
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ ingredientIds: ['gin', 'lime'], maxMissing: 'any' }),
			signal
		});
	});
});

import { describe, expect, it, vi } from 'vitest';
import type { $Fetch } from 'nitropack';
import { ingredientsRepository } from './ingredient.repository';
describe('ingredientsRepository.list', () => {
	const query = { page: 1, limit: 20, search: { name: 'gin' } };
	const serialized = { page: 1, limit: 20, search: JSON.stringify({ name: 'gin' }) };
	it('asks only for the ingredients in use when told to, next to the search and the paging', async () => {
		const fetchMock = vi.fn().mockResolvedValue([]);
		await ingredientsRepository(fetchMock as unknown as $Fetch).list(query, { inUse: true });
		expect(fetchMock).toHaveBeenCalledWith('/ingredients', {
			query: { ...serialized, inUse: true }
		});
	});
	it('sends inUse false as it is, and leaves it out when it is not given', async () => {
		const fetchMock = vi.fn().mockResolvedValue([]);
		const repository = ingredientsRepository(fetchMock as unknown as $Fetch);
		await repository.list(query, { inUse: false });
		await repository.list(query);
		expect(fetchMock).toHaveBeenNthCalledWith(1, '/ingredients', {
			query: { ...serialized, inUse: false }
		});
		expect(fetchMock).toHaveBeenNthCalledWith(2, '/ingredients', { query: serialized });
	});
});

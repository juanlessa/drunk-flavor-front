import { describe, expect, it, vi } from 'vitest';
import type { $Fetch } from 'nitropack';
import { favoritesRepository } from './favorite.repository';
const repositoryWith = (response: unknown) => {
	const fetchMock = vi.fn().mockResolvedValue(response);
	return { fetchMock, repository: favoritesRepository(fetchMock as unknown as $Fetch) };
};
describe('favoritesRepository', () => {
	it('adds with PUT and removes with DELETE on the path of the drink', async () => {
		const { fetchMock, repository } = repositoryWith(undefined);
		await repository.add('drink-1');
		await repository.remove('drink-1');
		expect(fetchMock).toHaveBeenNthCalledWith(1, '/me/favorites/drink-1', { method: 'PUT' });
		expect(fetchMock).toHaveBeenNthCalledWith(2, '/me/favorites/drink-1', { method: 'DELETE' });
	});
	it('lists the first page without a cursor and the next ones with the cursor it was given', async () => {
		const page = { items: [], nextCursor: 'abc' };
		const { fetchMock, repository } = repositoryWith(page);
		const first = await repository.list({ limit: 20 });
		await repository.list({ limit: 20, cursor: 'abc' });
		expect(first).toBe(page);
		expect(fetchMock).toHaveBeenNthCalledWith(1, '/me/favorites', {
			query: { limit: 20 },
			signal: undefined
		});
		expect(fetchMock).toHaveBeenNthCalledWith(2, '/me/favorites', {
			query: { limit: 20, cursor: 'abc' },
			signal: undefined
		});
	});
	it('sends no query at all when the list has no limit nor cursor', async () => {
		const { fetchMock, repository } = repositoryWith({ items: [], nextCursor: null });
		await repository.list();
		expect(fetchMock).toHaveBeenCalledWith('/me/favorites', { query: {}, signal: undefined });
	});
	it('gets the ids of the favorite drinks from /ids', async () => {
		const ids = { drinkIds: ['drink-1', 'drink-2'] };
		const { fetchMock, repository } = repositoryWith(ids);
		const { signal } = new AbortController();
		expect(await repository.listDrinkIds({ signal })).toBe(ids);
		expect(fetchMock).toHaveBeenCalledWith('/me/favorites/ids', { signal });
	});
});

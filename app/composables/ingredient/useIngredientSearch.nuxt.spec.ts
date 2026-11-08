import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getQuery } from 'h3';
import { registerEndpoint } from '@nuxt/test-utils/runtime';
import type { Ingredient } from '~/domain/ingredient/ingredient.entity';
import { useIngredientSearch } from './useIngredientSearch';

const requests: Record<string, unknown>[] = [];
registerEndpoint('/ingredients', {
	method: 'GET',
	handler: (event) => {
		requests.push(getQuery(event));
		return [];
	}
});

const ingredient = (id: string) => ({ id }) as Ingredient;

describe('useIngredientSearch', () => {
	let search: ReturnType<typeof useIngredientSearch>;

	beforeEach(() => {
		search = useIngredientSearch();
		search.initSelected([ingredient('rum'), ingredient('lime'), ingredient('mint')]);
	});

	const order = () => search.selected.value.map(({ id }) => id);

	it('moves a selected ingredient to another position', () => {
		search.moveSelected(2, 0);
		expect(order()).toEqual(['mint', 'rum', 'lime']);

		search.moveSelected(0, 1);
		expect(order()).toEqual(['rum', 'mint', 'lime']);
	});

	it('ignores out-of-range and no-op moves', () => {
		search.moveSelected(0, -1);
		search.moveSelected(2, 3);
		search.moveSelected(1, 1);

		expect(order()).toEqual(['rum', 'lime', 'mint']);
	});

	it('searches on the name and sorts by the current language, after a pause in typing', async () => {
		requests.length = 0;
		search.searchTerm.value = 'limao';
		await vi.waitFor(
			() => expect(requests.at(-1)?.search).toBe(JSON.stringify({ name: 'limao' })),
			{
				timeout: 2000
			}
		);

		expect(requests.at(-1)?.sort).toMatch(/translations\.\w+\.name/);
	});
});

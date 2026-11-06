import { beforeEach, describe, expect, it } from 'vitest';
import { registerEndpoint } from '@nuxt/test-utils/runtime';
import type { Ingredient } from '~/domain/ingredient/ingredient.entity';
import { useIngredientSearch } from './useIngredientSearch';

registerEndpoint('/ingredients', { method: 'GET', handler: () => [] });

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
});

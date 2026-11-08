import { describe, it, expect } from 'vitest';
import { drinkFormValidator } from './drink';
import type { DrinkForm } from '~/types/drink.types';

const buildForm = (ingredients: DrinkForm['ingredients']): DrinkForm => ({
	translations: {
		en: { name: 'Sex on the Beach', method: 'Shake' },
		pt: { name: 'Sex on the Beach', method: 'Agite' }
	},
	ingredients,
	garnishes: []
});
const exactLine = (ingredientId: string, quantity: number) => ({
	ingredientId,
	amount: { type: 'exact' as const, quantity, unitId: 'unit-1' },
	optional: false
});

describe('drinkFormValidator', () => {
	it('flags a zero quantity at the ingredient index with a translatable key', () => {
		const errors = drinkFormValidator(
			buildForm([exactLine('ing-1', 0), exactLine('ing-2', 30)])
		);

		expect(errors).toEqual([
			{ field: 'ingredients.0.amount.quantity', message: 'errors.drinks.quantity' }
		]);
	});

	it('flags an empty ingredient list', () => {
		const errors = drinkFormValidator(buildForm([]));

		expect(errors).toEqual([{ field: 'ingredients', message: 'errors.drinks.ingredients' }]);
	});

	it('flags an exact amount that has no unit', () => {
		const line = exactLine('ing-1', 60);
		const errors = drinkFormValidator(
			buildForm([{ ...line, amount: { ...line.amount, unitId: '' } }])
		);
		expect(errors.map(({ field }) => field)).toEqual(['ingredients.0.amount.unitId']);
	});
	it('does not check the quantity of an amount that is not exact', () => {
		const errors = drinkFormValidator(
			buildForm([
				{
					ingredientId: 'ing-1',
					amount: { type: 'qualitative', qualifier: 'to_taste' },
					optional: true
				},
				{ ingredientId: 'ing-2', amount: { type: 'none' }, optional: false }
			])
		);
		expect(errors).toEqual([]);
	});
	it('passes when every ingredient has a positive quantity', () => {
		expect(drinkFormValidator(buildForm([exactLine('ing-1', 60)]))).toEqual([]);
	});
});

import { describe, it, expect } from 'vitest';
import { drinkFormValidator } from './drink';
import type { DrinkForm } from '~/types/drink.types';

const buildForm = (ingredients: DrinkForm['ingredients']): DrinkForm => ({
	translations: {
		en: { name: 'Sex on the Beach', method: 'Shake' },
		pt: { name: 'Sex on the Beach', method: 'Agite' }
	},
	ingredients
});

describe('drinkFormValidator', () => {
	it('flags a zero quantity at the ingredient index with a translatable key', () => {
		const errors = drinkFormValidator(
			buildForm([
				{ ingredientId: 'ing-1', quantity: 0 },
				{ ingredientId: 'ing-2', quantity: 30 }
			])
		);

		expect(errors).toEqual([
			{ field: 'ingredients.0.quantity', message: 'errors.drinks.quantity' }
		]);
	});

	it('flags an empty ingredient list', () => {
		const errors = drinkFormValidator(buildForm([]));

		expect(errors).toEqual([{ field: 'ingredients', message: 'errors.drinks.ingredients' }]);
	});

	it('passes when every ingredient has a positive quantity', () => {
		expect(drinkFormValidator(buildForm([{ ingredientId: 'ing-1', quantity: 60 }]))).toEqual(
			[]
		);
	});
});

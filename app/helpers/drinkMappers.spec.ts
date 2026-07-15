import { describe, it, expect } from 'vitest';
import { mapDrinkToForm, mapFormToCreateDrink, mapFormToUpdateDrink } from './drinkMappers';
import type { Drink, DrinkForm } from '~/types/drink';

const mockDrink: Drink = {
	_id: 'drink-1',
	translations: {
		en: { name: 'Piña Colada', method: 'Blend everything' },
		pt: { name: 'Piña Colada', method: 'Bata tudo' }
	},
	cover: 'cover.jpg',
	thumbnail: 'thumb.jpg',
	ingredients: [
		{
			quantity: 60,
			ingredient: {
				_id: 'ing-1',
				translations: { en: { name: 'Rum', unit: 'ml', unit_plural: 'ml' }, pt: { name: 'Rum', unit: 'ml', unit_plural: 'ml' } },
				category: { _id: 'cat-1', translations: { en: { name: 'Spirits' }, pt: { name: 'Destilados' } }, created_at: new Date(), updated_at: new Date() },
				is_alcoholic: true,
				created_at: new Date(),
				updated_at: new Date()
			}
		},
		{
			quantity: 90,
			ingredient: {
				_id: 'ing-2',
				translations: { en: { name: 'Pineapple Juice', unit: 'ml', unit_plural: 'ml' }, pt: { name: 'Suco de abacaxi', unit: 'ml', unit_plural: 'ml' } },
				category: { _id: 'cat-2', translations: { en: { name: 'Juices' }, pt: { name: 'Sucos' } }, created_at: new Date(), updated_at: new Date() },
				is_alcoholic: false,
				created_at: new Date(),
				updated_at: new Date()
			}
		}
	],
	created_at: new Date(),
	updated_at: new Date()
};

const mockDrinkForm: DrinkForm = {
	translations: {
		en: { name: 'Piña Colada', method: 'Blend everything' },
		pt: { name: 'Piña Colada', method: 'Bata tudo' }
	},
	ingredients: [
		{ ingredient_id: 'ing-1', quantity: 60 },
		{ ingredient_id: 'ing-2', quantity: 90 }
	]
};

describe('mapDrinkToForm', () => {
	it('maps a drink entity to a form object', () => {
		const result = mapDrinkToForm(mockDrink);

		expect(result.translations).toEqual({
			en: { name: 'Piña Colada', method: 'Blend everything' },
			pt: { name: 'Piña Colada', method: 'Bata tudo' }
		});
	});

	it('maps ingredients to DrinkIngredientRequest format', () => {
		const result = mapDrinkToForm(mockDrink);

		expect(result.ingredients).toEqual([
			{ ingredient_id: 'ing-1', quantity: 60 },
			{ ingredient_id: 'ing-2', quantity: 90 }
		]);
	});

	it('does not include cover, thumbnail, or date fields', () => {
		const result = mapDrinkToForm(mockDrink);

		expect(result).not.toHaveProperty('_id');
		expect(result).not.toHaveProperty('cover');
		expect(result).not.toHaveProperty('thumbnail');
		expect(result).not.toHaveProperty('created_at');
	});

	it('handles empty ingredients array', () => {
		const drinkNoIngredients = { ...mockDrink, ingredients: [] };
		const result = mapDrinkToForm(drinkNoIngredients);

		expect(result.ingredients).toEqual([]);
	});
});

describe('mapFormToCreateDrink', () => {
	it('maps a form to a create request', () => {
		const result = mapFormToCreateDrink(mockDrinkForm);

		expect(result).toEqual({
			translations: {
				en: { name: 'Piña Colada', method: 'Blend everything' },
				pt: { name: 'Piña Colada', method: 'Bata tudo' }
			},
			ingredients: [
				{ ingredient_id: 'ing-1', quantity: 60 },
				{ ingredient_id: 'ing-2', quantity: 90 }
			]
		});
	});
});

describe('mapFormToUpdateDrink', () => {
	it('maps a form to an update request with id', () => {
		const result = mapFormToUpdateDrink('drink-1', mockDrinkForm);

		expect(result).toEqual({
			id: 'drink-1',
			translations: {
				en: { name: 'Piña Colada', method: 'Blend everything' },
				pt: { name: 'Piña Colada', method: 'Bata tudo' }
			},
			ingredients: [
				{ ingredient_id: 'ing-1', quantity: 60 },
				{ ingredient_id: 'ing-2', quantity: 90 }
			]
		});
	});

	it('includes the provided id', () => {
		const result = mapFormToUpdateDrink('custom-id', mockDrinkForm);

		expect(result.id).toBe('custom-id');
	});
});

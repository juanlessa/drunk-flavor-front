import { describe, it, expect } from 'vitest';
import { mapDrinkToForm, mapFormToCreateDrink, mapFormToUpdateDrink } from './drink.mappers';
import type { DrinkForm } from '../types/drink.types';
import type { Drink } from '~/domain/drink/drink.entity';
import type { Unit } from '~/domain/unit/unit.entity';

const mockMilliliterUnit: Unit = {
	_id: 'unit-1',
	translations: {
		en: { name: 'milliliter', name_plural: 'milliliters' },
		pt: { name: 'mililitro', name_plural: 'mililitros' }
	},
	symbol: 'ml',
	space_before_symbol: false,
	allow_decimal: true,
	kind: 'volume',
	created_at: new Date(),
	updated_at: new Date()
};

const mockDrink: Drink = {
	_id: 'drink-1',
	translations: {
		en: { name: 'Piña Colada', method: 'Blend everything' },
		pt: { name: 'Piña Colada', method: 'Bata tudo' }
	},
	cover: { name: 'cover.jpg', mimetype: 'image/jpeg', url: 'https://example.com/cover.jpg' },
	thumbnail: { name: 'thumb.jpg', mimetype: 'image/jpeg', url: 'https://example.com/thumb.jpg' },
	ingredients: [
		{
			quantity: 60,
			ingredient: {
				_id: 'ing-1',
				translations: {
					en: { name: 'Rum' },
					pt: { name: 'Rum' }
				},
				category: {
					_id: 'cat-1',
					translations: { en: { name: 'Spirits' }, pt: { name: 'Destilados' } },
					is_alcoholic: true,
					created_at: new Date(),
					updated_at: new Date()
				},
				unit: mockMilliliterUnit,
				created_at: new Date(),
				updated_at: new Date()
			}
		},
		{
			quantity: 90,
			ingredient: {
				_id: 'ing-2',
				translations: {
					en: { name: 'Pineapple Juice' },
					pt: { name: 'Suco de abacaxi' }
				},
				category: {
					_id: 'cat-2',
					translations: { en: { name: 'Juices' }, pt: { name: 'Sucos' } },
					is_alcoholic: false,
					created_at: new Date(),
					updated_at: new Date()
				},
				unit: mockMilliliterUnit,
				created_at: new Date(),
				updated_at: new Date()
			}
		}
	],
	avg_rating: 0,
	ratings_count: 0,
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

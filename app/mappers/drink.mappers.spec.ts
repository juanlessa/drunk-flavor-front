import { describe, it, expect } from 'vitest';
import { mapDrinkToForm, mapFormToCreateDrink, mapFormToUpdateDrink } from './drink.mappers';
import type { DrinkForm } from '../types/drink.types';
import type { Drink } from '~/domain/drink/drink.entity';
import type { Ingredient } from '~/domain/ingredient/ingredient.entity';
import type { PreparationPlan } from '~/domain/preparation/preparation.entity';
import type { Unit } from '~/domain/unit/unit.entity';

const mockMilliliterUnit: Unit = {
	id: 'unit-1',
	translations: {
		en: { name: 'milliliter', namePlural: 'milliliters' },
		pt: { name: 'mililitro', namePlural: 'mililitros', gender: 'masculine' }
	},
	symbol: 'ml',
	spaceBeforeSymbol: false,
	allowDecimal: true,
	kind: 'volume',
	createdAt: new Date(),
	updatedAt: new Date()
};
const buildIngredient = (id: string, en: string, pt: string): Ingredient => ({
	id,
	translations: { en: { name: en }, pt: { name: pt, gender: 'masculine' } },
	category: {
		id: 'cat-1',
		translations: { en: { name: 'Spirits' }, pt: { name: 'Destilados' } },
		isAlcoholic: true,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	units: [mockMilliliterUnit],
	kind: 'generic',
	createdAt: new Date(),
	updatedAt: new Date()
});
const mockPlan: PreparationPlan = {
	mixingVessel: 'serving_glass',
	servingGlass: 'rocks',
	actions: [
		{
			type: 'add',
			target: 'mixing',
			items: [{ list: 'ingredients', ingredientId: 'ing-1', unitId: 'unit-1' }]
		}
	]
};
const mockDrink: Drink = {
	id: 'drink-1',
	translations: {
		en: { name: 'Piña Colada', method: 'Blend everything' },
		pt: { name: 'Piña Colada', method: 'Bata tudo' }
	},
	cover: { name: 'cover.jpg', mimetype: 'image/jpeg', url: 'https://example.com/cover.jpg' },
	thumbnail: { name: 'thumb.jpg', mimetype: 'image/jpeg', url: 'https://example.com/thumb.jpg' },
	ingredients: [
		{
			ingredient: buildIngredient('ing-1', 'Rum', 'Rum'),
			amount: { type: 'exact', quantity: 60, unit: mockMilliliterUnit },
			optional: false
		},
		{
			ingredient: buildIngredient('ing-2', 'Pineapple Juice', 'Suco de abacaxi'),
			amount: {
				type: 'qualitative',
				qualifier: 'top_up',
				quantity: 90,
				unit: mockMilliliterUnit
			},
			optional: true
		},
		{
			ingredient: buildIngredient('ing-3', 'Ginger foam', 'Espuma de gengibre'),
			amount: { type: 'none' },
			optional: false
		}
	],
	garnishes: [
		{
			ingredient: buildIngredient('ing-4', 'Lime', 'Limão'),
			amount: { type: 'exact', quantity: 1, unit: mockMilliliterUnit }
		}
	],
	avgRating: 0,
	ratingsCount: 0,
	createdAt: new Date(),
	updatedAt: new Date()
};
const mockDrinkForm: DrinkForm = {
	translations: {
		en: { name: 'Piña Colada', method: 'Blend everything' },
		pt: { name: 'Piña Colada', method: 'Bata tudo' }
	},
	ingredients: [
		{
			ingredientId: 'ing-1',
			amount: { type: 'exact', quantity: 60, unitId: 'unit-1' },
			optional: false
		},
		{ ingredientId: 'ing-2', amount: { type: 'none' }, optional: true }
	],
	garnishes: [{ ingredientId: 'ing-4', amount: { type: 'none' } }]
};
const mockPlannedForm: DrinkForm = { ...mockDrinkForm, preparation: mockPlan };

describe('mapDrinkToForm', () => {
	it('maps the translations', () => {
		const result = mapDrinkToForm(mockDrink);
		expect(result.translations).toEqual({
			en: { name: 'Piña Colada', method: 'Blend everything' },
			pt: { name: 'Piña Colada', method: 'Bata tudo' }
		});
	});
	it('maps every kind of amount of the ingredients to its request format, keeping the optional flag', () => {
		const result = mapDrinkToForm(mockDrink);
		expect(result.ingredients).toEqual([
			{
				ingredientId: 'ing-1',
				amount: { type: 'exact', quantity: 60, unitId: 'unit-1' },
				optional: false
			},
			{
				ingredientId: 'ing-2',
				amount: {
					type: 'qualitative',
					qualifier: 'top_up',
					quantity: 90,
					unitId: 'unit-1'
				},
				optional: true
			},
			{ ingredientId: 'ing-3', amount: { type: 'none' }, optional: false }
		]);
	});
	it('maps the garnishes, which have no optional flag', () => {
		const result = mapDrinkToForm(mockDrink);
		expect(result.garnishes).toEqual([
			{ ingredientId: 'ing-4', amount: { type: 'exact', quantity: 1, unitId: 'unit-1' } }
		]);
	});
	it('carries a copy of the preparation plan, and has none for a drink written by hand', () => {
		const planned = mapDrinkToForm({ ...mockDrink, preparation: mockPlan });
		expect(planned.preparation).toEqual(mockPlan);
		expect(planned.preparation).not.toBe(mockPlan);
		expect(mapDrinkToForm(mockDrink)).not.toHaveProperty('preparation');
	});
	it('does not include cover, thumbnail, or date fields', () => {
		const result = mapDrinkToForm(mockDrink);
		expect(result).not.toHaveProperty('id');
		expect(result).not.toHaveProperty('cover');
		expect(result).not.toHaveProperty('thumbnail');
		expect(result).not.toHaveProperty('createdAt');
	});
	it('handles empty ingredients and garnishes', () => {
		const result = mapDrinkToForm({ ...mockDrink, ingredients: [], garnishes: [] });
		expect(result.ingredients).toEqual([]);
		expect(result.garnishes).toEqual([]);
	});
});

describe('mapFormToCreateDrink', () => {
	it('sends the methods written by hand, and no plan, for a drink without a plan', () => {
		const result = mapFormToCreateDrink(mockDrinkForm);
		expect(result).toEqual({
			translations: {
				en: { name: 'Piña Colada', method: 'Blend everything' },
				pt: { name: 'Piña Colada', method: 'Bata tudo' }
			},
			ingredients: mockDrinkForm.ingredients,
			garnishes: mockDrinkForm.garnishes
		});
		expect(result).not.toHaveProperty('preparation');
	});
	it('sends the plan and only the names, never the methods, for a drink with a plan', () => {
		const result = mapFormToCreateDrink(mockPlannedForm);
		expect(result.preparation).toEqual(mockPlan);
		expect(result.translations).toEqual({
			en: { name: 'Piña Colada' },
			pt: { name: 'Piña Colada' }
		});
	});
});

describe('mapFormToUpdateDrink', () => {
	it('maps a form to an update request with id, sending the garnishes it carries', () => {
		const result = mapFormToUpdateDrink('drink-1', mockDrinkForm);
		expect(result).toEqual({
			id: 'drink-1',
			translations: {
				en: { name: 'Piña Colada', method: 'Blend everything' },
				pt: { name: 'Piña Colada', method: 'Bata tudo' }
			},
			ingredients: mockDrinkForm.ingredients,
			garnishes: mockDrinkForm.garnishes
		});
	});
	it('keeps the plan of a planned drink, so editing the drink does not remove it', () => {
		const result = mapFormToUpdateDrink('drink-1', mockPlannedForm);
		expect(result.preparation).toEqual(mockPlan);
		expect(result.translations.en).toEqual({ name: 'Piña Colada' });
	});
	it('includes the provided id', () => {
		const result = mapFormToUpdateDrink('custom-id', mockDrinkForm);
		expect(result.id).toBe('custom-id');
	});
});

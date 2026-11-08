import { describe, it, expect } from 'vitest';
import {
	mapIngredientToForm,
	mapFormToCreateIngredient,
	mapFormToUpdateIngredient
} from './ingredient.mappers';
import type { IngredientForm } from '../types/ingredient.types';
import type { Ingredient } from '~/domain/ingredient/ingredient.entity';
import type { Unit } from '~/domain/unit/unit.entity';

const mockIngredient: Ingredient = {
	id: 'ing-1',
	translations: {
		en: { name: 'Rum' },
		pt: { name: 'Rum' }
	},
	category: {
		id: 'cat-1',
		translations: { en: { name: 'Spirits' }, pt: { name: 'Destilados' } },
		isAlcoholic: true,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	units: [
		{
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
		}
	],
	kind: 'generic',
	createdAt: new Date(),
	updatedAt: new Date()
};

const mockIngredientForm: IngredientForm = {
	translations: {
		en: { name: 'Rum' },
		pt: { name: 'Rum' }
	},
	categoryId: 'cat-1',
	unitIds: ['unit-1']
};

describe('mapIngredientToForm', () => {
	it('maps an ingredient entity to a form object', () => {
		const result = mapIngredientToForm(mockIngredient);

		expect(result).toEqual({
			translations: {
				en: { name: 'Rum' },
				pt: { name: 'Rum' }
			},
			categoryId: 'cat-1',
			unitIds: ['unit-1']
		});
	});

	it('extracts categoryId from the category object', () => {
		const result = mapIngredientToForm(mockIngredient);

		expect(result.categoryId).toBe(mockIngredient.category.id);
	});

	it('extracts the ids of every allowed unit, in order', () => {
		const first = mockIngredient.units[0] as Unit;
		const result = mapIngredientToForm({
			...mockIngredient,
			units: [first, { ...first, id: 'unit-2' }]
		});

		expect(result.unitIds).toEqual(['unit-1', 'unit-2']);
	});

	it('keeps the description and the gender of the translations', () => {
		const result = mapIngredientToForm({
			...mockIngredient,
			translations: {
				en: { name: 'Triple sec', description: 'Orange liqueur' },
				pt: { name: 'Triple sec', gender: 'masculine', description: 'Licor de laranja' }
			}
		});

		expect(result.translations.pt).toEqual({
			name: 'Triple sec',
			gender: 'masculine',
			description: 'Licor de laranja'
		});
	});

	it('does not include id or date fields', () => {
		const result = mapIngredientToForm(mockIngredient);

		expect(result).not.toHaveProperty('id');
		expect(result).not.toHaveProperty('createdAt');
	});
});

describe('mapFormToCreateIngredient', () => {
	it('maps a form to a create request', () => {
		const result = mapFormToCreateIngredient(mockIngredientForm);

		expect(result).toEqual({
			translations: {
				en: { name: 'Rum' },
				pt: { name: 'Rum' }
			},
			categoryId: 'cat-1',
			unitIds: ['unit-1']
		});
	});
});

describe('mapFormToUpdateIngredient', () => {
	it('maps a form to an update request with id', () => {
		const result = mapFormToUpdateIngredient('ing-1', mockIngredientForm);

		expect(result).toEqual({
			id: 'ing-1',
			translations: {
				en: { name: 'Rum' },
				pt: { name: 'Rum' }
			},
			categoryId: 'cat-1',
			unitIds: ['unit-1']
		});
	});

	it('includes the provided id', () => {
		const result = mapFormToUpdateIngredient('custom-id', mockIngredientForm);

		expect(result.id).toBe('custom-id');
	});
});

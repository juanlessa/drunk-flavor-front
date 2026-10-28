import { describe, it, expect } from 'vitest';
import {
	mapIngredientToForm,
	mapFormToCreateIngredient,
	mapFormToUpdateIngredient
} from './ingredient.mappers';
import type { IngredientForm } from '../types/ingredient.types';
import type { Ingredient } from '~/domain/ingredient/ingredient.entity';

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
	unit: {
		id: 'unit-1',
		translations: {
			en: { name: 'milliliter', namePlural: 'milliliters' },
			pt: { name: 'mililitro', namePlural: 'mililitros' }
		},
		symbol: 'ml',
		spaceBeforeSymbol: false,
		allowDecimal: true,
		kind: 'volume',
		createdAt: new Date(),
		updatedAt: new Date()
	},
	createdAt: new Date(),
	updatedAt: new Date()
};

const mockIngredientForm: IngredientForm = {
	translations: {
		en: { name: 'Rum' },
		pt: { name: 'Rum' }
	},
	categoryId: 'cat-1',
	unitId: 'unit-1'
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
			unitId: 'unit-1'
		});
	});

	it('extracts categoryId from the category object', () => {
		const result = mapIngredientToForm(mockIngredient);

		expect(result.categoryId).toBe(mockIngredient.category.id);
	});

	it('extracts unitId from the unit object', () => {
		const result = mapIngredientToForm(mockIngredient);

		expect(result.unitId).toBe(mockIngredient.unit.id);
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
			unitId: 'unit-1'
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
			unitId: 'unit-1'
		});
	});

	it('includes the provided id', () => {
		const result = mapFormToUpdateIngredient('custom-id', mockIngredientForm);

		expect(result.id).toBe('custom-id');
	});
});

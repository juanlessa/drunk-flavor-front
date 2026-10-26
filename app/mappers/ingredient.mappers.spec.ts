import { describe, it, expect } from 'vitest';
import {
	mapIngredientToForm,
	mapFormToCreateIngredient,
	mapFormToUpdateIngredient
} from './ingredient.mappers';
import type { IngredientForm } from '../types/ingredient.types';
import type { Ingredient } from '~/domain/ingredient/ingredient.entity';

const mockIngredient: Ingredient = {
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
	unit: {
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
	},
	created_at: new Date(),
	updated_at: new Date()
};

const mockIngredientForm: IngredientForm = {
	translations: {
		en: { name: 'Rum' },
		pt: { name: 'Rum' }
	},
	category_id: 'cat-1',
	unit_id: 'unit-1'
};

describe('mapIngredientToForm', () => {
	it('maps an ingredient entity to a form object', () => {
		const result = mapIngredientToForm(mockIngredient);

		expect(result).toEqual({
			translations: {
				en: { name: 'Rum' },
				pt: { name: 'Rum' }
			},
			category_id: 'cat-1',
			unit_id: 'unit-1'
		});
	});

	it('extracts category_id from the category object', () => {
		const result = mapIngredientToForm(mockIngredient);

		expect(result.category_id).toBe(mockIngredient.category._id);
	});

	it('extracts unit_id from the unit object', () => {
		const result = mapIngredientToForm(mockIngredient);

		expect(result.unit_id).toBe(mockIngredient.unit._id);
	});

	it('does not include _id or date fields', () => {
		const result = mapIngredientToForm(mockIngredient);

		expect(result).not.toHaveProperty('_id');
		expect(result).not.toHaveProperty('created_at');
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
			category_id: 'cat-1',
			unit_id: 'unit-1'
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
			category_id: 'cat-1',
			unit_id: 'unit-1'
		});
	});

	it('includes the provided id', () => {
		const result = mapFormToUpdateIngredient('custom-id', mockIngredientForm);

		expect(result.id).toBe('custom-id');
	});
});

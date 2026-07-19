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
		en: { name: 'Rum', unit: 'ml', unit_plural: 'ml' },
		pt: { name: 'Rum', unit: 'ml', unit_plural: 'ml' }
	},
	category: {
		_id: 'cat-1',
		translations: { en: { name: 'Spirits' }, pt: { name: 'Destilados' } },
		created_at: new Date(),
		updated_at: new Date()
	},
	is_alcoholic: true,
	created_at: new Date(),
	updated_at: new Date()
};

const mockIngredientForm: IngredientForm = {
	translations: {
		en: { name: 'Rum', unit: 'ml', unit_plural: 'ml' },
		pt: { name: 'Rum', unit: 'ml', unit_plural: 'ml' }
	},
	is_alcoholic: true,
	category_id: 'cat-1'
};

describe('mapIngredientToForm', () => {
	it('maps an ingredient entity to a form object', () => {
		const result = mapIngredientToForm(mockIngredient);

		expect(result).toEqual({
			translations: {
				en: { name: 'Rum', unit: 'ml', unit_plural: 'ml' },
				pt: { name: 'Rum', unit: 'ml', unit_plural: 'ml' }
			},
			is_alcoholic: true,
			category_id: 'cat-1'
		});
	});

	it('extracts category_id from the category object', () => {
		const result = mapIngredientToForm(mockIngredient);

		expect(result.category_id).toBe(mockIngredient.category._id);
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
				en: { name: 'Rum', unit: 'ml', unit_plural: 'ml' },
				pt: { name: 'Rum', unit: 'ml', unit_plural: 'ml' }
			},
			is_alcoholic: true,
			category_id: 'cat-1'
		});
	});
});

describe('mapFormToUpdateIngredient', () => {
	it('maps a form to an update request with id', () => {
		const result = mapFormToUpdateIngredient('ing-1', mockIngredientForm);

		expect(result).toEqual({
			id: 'ing-1',
			translations: {
				en: { name: 'Rum', unit: 'ml', unit_plural: 'ml' },
				pt: { name: 'Rum', unit: 'ml', unit_plural: 'ml' }
			},
			is_alcoholic: true,
			category_id: 'cat-1'
		});
	});

	it('includes the provided id', () => {
		const result = mapFormToUpdateIngredient('custom-id', mockIngredientForm);

		expect(result.id).toBe('custom-id');
	});
});

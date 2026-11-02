import { describe, it, expect } from 'vitest';
import {
	mapCategoryToForm,
	mapFormToCreateCategory,
	mapFormToUpdateCategory
} from './category.mappers';
import type { Category } from '~/domain/category/category.entity';
import type { CategoryForm } from '~/types/category.types';

const mockCategory: Category = {
	id: 'cat-1',
	translations: {
		en: { name: 'Juice' },
		pt: { name: 'Suco' }
	},
	isAlcoholic: false,
	createdAt: new Date(),
	updatedAt: new Date()
};

const mockCategoryForm: CategoryForm = {
	translations: {
		en: { name: 'Juice' },
		pt: { name: 'Suco' }
	},
	isAlcoholic: false
};

describe('mapCategoryToForm', () => {
	it('maps a category entity to a form object', () => {
		const result = mapCategoryToForm(mockCategory);

		expect(result).toEqual({
			translations: {
				en: { name: 'Juice' },
				pt: { name: 'Suco' }
			},
			isAlcoholic: false
		});
	});

	it('does not include id or date fields', () => {
		const result = mapCategoryToForm(mockCategory);

		expect(result).not.toHaveProperty('id');
		expect(result).not.toHaveProperty('createdAt');
		expect(result).not.toHaveProperty('updatedAt');
	});

	it('creates a new object (not a reference)', () => {
		const result = mapCategoryToForm(mockCategory);

		expect(result.translations.en).not.toBe(mockCategory.translations.en);
	});
});

describe('mapFormToCreateCategory', () => {
	it('maps a form to a create request', () => {
		const result = mapFormToCreateCategory(mockCategoryForm);

		expect(result).toEqual({
			translations: {
				en: { name: 'Juice' },
				pt: { name: 'Suco' }
			},
			isAlcoholic: false
		});
	});

	it('creates a new translations object', () => {
		const result = mapFormToCreateCategory(mockCategoryForm);

		expect(result.translations.en).not.toBe(mockCategoryForm.translations.en);
	});
});

describe('mapFormToUpdateCategory', () => {
	it('maps a form to an update request with id', () => {
		const result = mapFormToUpdateCategory('cat-1', mockCategoryForm);

		expect(result).toEqual({
			id: 'cat-1',
			translations: {
				en: { name: 'Juice' },
				pt: { name: 'Suco' }
			},
			isAlcoholic: false
		});
	});

	it('includes the provided id', () => {
		const result = mapFormToUpdateCategory('custom-id', mockCategoryForm);

		expect(result.id).toBe('custom-id');
	});
});

import { describe, it, expect } from 'vitest';
import { mapCategoryToForm, mapFormToCreateCategory, mapFormToUpdateCategory } from './categoryMappers';
import type { Category, CategoryForm } from '~/types/category';

const mockCategory: Category = {
	_id: 'cat-1',
	translations: {
		en: { name: 'Juice' },
		pt: { name: 'Suco' }
	},
	created_at: new Date(),
	updated_at: new Date()
};

const mockCategoryForm: CategoryForm = {
	translations: {
		en: { name: 'Juice' },
		pt: { name: 'Suco' }
	}
};

describe('mapCategoryToForm', () => {
	it('maps a category entity to a form object', () => {
		const result = mapCategoryToForm(mockCategory);

		expect(result).toEqual({
			translations: {
				en: { name: 'Juice' },
				pt: { name: 'Suco' }
			}
		});
	});

	it('does not include _id or date fields', () => {
		const result = mapCategoryToForm(mockCategory);

		expect(result).not.toHaveProperty('_id');
		expect(result).not.toHaveProperty('created_at');
		expect(result).not.toHaveProperty('updated_at');
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
			}
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
			}
		});
	});

	it('includes the provided id', () => {
		const result = mapFormToUpdateCategory('custom-id', mockCategoryForm);

		expect(result.id).toBe('custom-id');
	});
});

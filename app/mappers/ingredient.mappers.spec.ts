import { describe, it, expect } from 'vitest';
import {
	mapIngredientToForm,
	mapFormToCreateIngredient,
	mapFormToUpdateIngredient
} from './ingredient.mappers';
import type { IngredientForm } from '../types/ingredient.types';
import type { Ingredient } from '~/domain/ingredient/ingredient.entity';
import type { Unit } from '~/domain/unit/unit.entity';

const buildUnit = (id: string): Unit => ({
	id,
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
});
const buildIngredient = (overrides: Partial<Ingredient> = {}): Ingredient => ({
	id: 'ing-1',
	translations: {
		en: { name: 'Rum' },
		pt: { name: 'Rum', gender: 'masculine' }
	},
	category: {
		id: 'cat-1',
		translations: { en: { name: 'Spirits' }, pt: { name: 'Destilados' } },
		isAlcoholic: true,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	units: [buildUnit('unit-1')],
	kind: 'generic',
	createdAt: new Date(),
	updatedAt: new Date(),
	...overrides
});
const buildForm = (overrides: Partial<IngredientForm> = {}): IngredientForm => ({
	translations: {
		en: { name: 'Rum', description: '' },
		pt: { name: 'Rum', description: '', gender: 'masculine' }
	},
	categoryId: 'cat-1',
	kind: 'generic',
	brand: '',
	measurable: true,
	unitIds: ['unit-1'],
	...overrides
});

describe('mapIngredientToForm', () => {
	it('maps an ingredient entity to a form object', () => {
		expect(mapIngredientToForm(buildIngredient())).toEqual(buildForm());
	});

	it('extracts categoryId from the category object', () => {
		expect(mapIngredientToForm(buildIngredient()).categoryId).toBe('cat-1');
	});

	it('extracts the ids of every allowed unit, in order', () => {
		const result = mapIngredientToForm(
			buildIngredient({ units: [buildUnit('unit-1'), buildUnit('unit-2')] })
		);

		expect(result.unitIds).toEqual(['unit-1', 'unit-2']);
		expect(result.measurable).toBe(true);
	});

	it('treats an ingredient with no units as one that cannot be measured', () => {
		const result = mapIngredientToForm(buildIngredient({ units: [] }));

		expect(result.measurable).toBe(false);
		expect(result.unitIds).toEqual([]);
	});

	it('keeps the description and the gender of the translations, with an empty text for no description', () => {
		const result = mapIngredientToForm(
			buildIngredient({
				translations: {
					en: { name: 'Triple sec', description: 'Orange liqueur' },
					pt: { name: 'Triple sec', gender: 'masculine' }
				}
			})
		);

		expect(result.translations).toEqual({
			en: { name: 'Triple sec', description: 'Orange liqueur' },
			pt: { name: 'Triple sec', gender: 'masculine', description: '' }
		});
	});

	it('maps the kind and the brand, with an empty text for no brand', () => {
		expect(
			mapIngredientToForm(buildIngredient({ kind: 'branded', brand: 'Licor 43' }))
		).toMatchObject({
			kind: 'branded',
			brand: 'Licor 43'
		});
		expect(mapIngredientToForm(buildIngredient())).toMatchObject({
			kind: 'generic',
			brand: ''
		});
	});

	it('does not include id or date fields', () => {
		const result = mapIngredientToForm(buildIngredient());

		expect(result).not.toHaveProperty('id');
		expect(result).not.toHaveProperty('createdAt');
	});
});

describe('mapFormToCreateIngredient', () => {
	it('maps a form to a create request without a brand for an ingredient of any brand', () => {
		const result = mapFormToCreateIngredient(buildForm({ brand: 'left over' }));

		expect(result).toEqual({
			translations: {
				en: { name: 'Rum' },
				pt: { name: 'Rum', gender: 'masculine' }
			},
			categoryId: 'cat-1',
			unitIds: ['unit-1'],
			kind: 'generic'
		});
	});

	it('sends the trimmed brand of a branded ingredient', () => {
		const result = mapFormToCreateIngredient(
			buildForm({ kind: 'branded', brand: '  Licor 43 ' })
		);

		expect(result).toMatchObject({ kind: 'branded', brand: 'Licor 43' });
	});

	it('sends the trimmed description and omits an empty one', () => {
		const result = mapFormToCreateIngredient(
			buildForm({
				translations: {
					en: { name: 'Triple sec', description: '  Orange liqueur ' },
					pt: { name: 'Triple sec', description: '   ', gender: 'masculine' }
				}
			})
		);

		expect(result.translations.en).toEqual({
			name: 'Triple sec',
			description: 'Orange liqueur'
		});
		expect(result.translations.pt).toEqual({ name: 'Triple sec', gender: 'masculine' });
	});

	it('sends no units for an ingredient that cannot be measured, whatever was picked before', () => {
		const result = mapFormToCreateIngredient(
			buildForm({ measurable: false, unitIds: ['unit-1'] })
		);

		expect(result.unitIds).toEqual([]);
	});

	it('does not share the list of units with the form', () => {
		const form = buildForm();

		expect(mapFormToCreateIngredient(form).unitIds).not.toBe(form.unitIds);
	});
});

describe('mapFormToUpdateIngredient', () => {
	it('maps a form to an update request with id, clearing the brand of an ingredient of any brand', () => {
		const result = mapFormToUpdateIngredient('ing-1', buildForm());

		expect(result).toEqual({
			id: 'ing-1',
			translations: {
				en: { name: 'Rum', description: null },
				pt: { name: 'Rum', description: null, gender: 'masculine' }
			},
			categoryId: 'cat-1',
			unitIds: ['unit-1'],
			kind: 'generic',
			brand: null
		});
	});

	it('sends the trimmed brand of a branded ingredient', () => {
		const result = mapFormToUpdateIngredient(
			'ing-1',
			buildForm({ kind: 'branded', brand: ' Licor 43 ' })
		);

		expect(result).toMatchObject({ kind: 'branded', brand: 'Licor 43' });
	});

	it('sends null for an empty description, which removes the stored one, and the text otherwise', () => {
		const result = mapFormToUpdateIngredient(
			'ing-1',
			buildForm({
				translations: {
					en: { name: 'Triple sec', description: ' Orange liqueur ' },
					pt: { name: 'Triple sec', description: '', gender: 'masculine' }
				}
			})
		);

		expect(result.translations.en.description).toBe('Orange liqueur');
		expect(result.translations.pt.description).toBeNull();
	});

	it('sends an empty list of units to remove them when the ingredient can no longer be measured', () => {
		expect(
			mapFormToUpdateIngredient('ing-1', buildForm({ measurable: false })).unitIds
		).toEqual([]);
	});

	it('includes the provided id', () => {
		expect(mapFormToUpdateIngredient('custom-id', buildForm()).id).toBe('custom-id');
	});
});

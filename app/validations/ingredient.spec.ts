import { describe, expect, it } from 'vitest';
import type { IngredientForm } from '~/types/ingredient.types';
import { ingredientFormValidator } from './ingredient';

const buildForm = (overrides: Partial<IngredientForm> = {}): IngredientForm => ({
	translations: {
		en: { name: 'Gin', description: '' },
		pt: { name: 'Gin', description: '', gender: 'masculine' }
	},
	categoryId: 'cat-1',
	kind: 'generic',
	brand: '',
	measurable: true,
	unitIds: ['unit-1'],
	requiresNamePlural: false,
	...overrides
});
const withPt = (pt: Partial<IngredientForm['translations']['pt']>) => ({
	translations: {
		en: { name: 'Gin', description: '' },
		pt: { name: 'Gin', description: '', gender: 'masculine' as const, ...pt }
	}
});
const fieldsOf = (form: IngredientForm) => ingredientFormValidator(form).map(({ field }) => field);

describe('ingredientFormValidator', () => {
	it('accepts a complete ingredient', () => {
		expect(ingredientFormValidator(buildForm())).toEqual([]);
	});

	describe('gender', () => {
		it('flags a missing gender in Portuguese with a translatable key', () => {
			const { gender: _, ...withoutGender } = buildForm().translations.pt;

			expect(
				ingredientFormValidator(
					buildForm({ translations: { ...buildForm().translations, pt: withoutGender } })
				)
			).toEqual([{ field: 'translations.pt.gender', message: 'errors.ingredients.gender' }]);
		});

		it('does not ask for a gender in English', () => {
			expect(fieldsOf(buildForm())).not.toContain('translations.en.gender');
		});
	});

	describe('description', () => {
		it('may be empty', () => {
			expect(fieldsOf(buildForm())).toEqual([]);
		});

		it('accepts up to 120 characters and flags more', () => {
			expect(fieldsOf(buildForm(withPt({ description: 'a'.repeat(120) })))).toEqual([]);
			expect(
				ingredientFormValidator(buildForm(withPt({ description: 'a'.repeat(121) })))
			).toEqual([
				{ field: 'translations.pt.description', message: 'errors.ingredients.description' }
			]);
		});
	});

	describe('plural name', () => {
		const withPlurals = (en: string | undefined, pt: string | undefined, required = true) =>
			buildForm({
				requiresNamePlural: required,
				translations: {
					en: { name: 'Lime', description: '', namePlural: en },
					pt: { name: 'Limão', description: '', namePlural: pt, gender: 'masculine' }
				}
			});
		it('is optional while no unit is written with the ingredient name', () => {
			expect(fieldsOf(withPlurals('', '', false))).toEqual([]);
			expect(fieldsOf(withPlurals(undefined, undefined, false))).toEqual([]);
		});
		it('is required in every language while a unit is written with the ingredient name', () => {
			expect(ingredientFormValidator(withPlurals('', ''))).toEqual([
				{ field: 'translations.en.namePlural', message: 'errors.ingredients.namePlural' },
				{ field: 'translations.pt.namePlural', message: 'errors.ingredients.namePlural' }
			]);
		});
		it('flags only the language that lacks it, treating blank spaces and undefined as missing', () => {
			expect(fieldsOf(withPlurals('Limes', '   '))).toEqual(['translations.pt.namePlural']);
			expect(fieldsOf(withPlurals(undefined, 'Limões'))).toEqual([
				'translations.en.namePlural'
			]);
		});
		it('accepts both plural names', () => {
			expect(fieldsOf(withPlurals('Limes', 'Limões'))).toEqual([]);
		});
		it('is not asked for once the ingredient cannot be measured', () => {
			expect(fieldsOf({ ...withPlurals('', ''), measurable: false, unitIds: [] })).toEqual(
				[]
			);
		});
	});
	describe('brand', () => {
		it('is not needed for an ingredient of any brand', () => {
			expect(fieldsOf(buildForm({ kind: 'generic', brand: '' }))).toEqual([]);
		});

		it('is required for a branded ingredient', () => {
			expect(ingredientFormValidator(buildForm({ kind: 'branded', brand: '   ' }))).toEqual([
				{ field: 'brand', message: 'errors.ingredients.brand' }
			]);
		});

		it('accepts up to 60 characters and flags more', () => {
			expect(fieldsOf(buildForm({ kind: 'branded', brand: 'a'.repeat(60) }))).toEqual([]);
			expect(fieldsOf(buildForm({ kind: 'branded', brand: 'a'.repeat(61) }))).toEqual([
				'brand'
			]);
		});

		it('is not checked once the ingredient goes back to any brand', () => {
			expect(fieldsOf(buildForm({ kind: 'generic', brand: 'a'.repeat(200) }))).toEqual([]);
		});
	});

	describe('units', () => {
		it('flags a measurable ingredient with no unit', () => {
			expect(ingredientFormValidator(buildForm({ unitIds: [] }))).toEqual([
				{ field: 'unitIds', message: 'errors.ingredients.unit' }
			]);
		});

		it('does not ask for a unit when the ingredient cannot be measured', () => {
			expect(fieldsOf(buildForm({ measurable: false, unitIds: [] }))).toEqual([]);
		});
	});

	it('flags a missing category', () => {
		expect(ingredientFormValidator(buildForm({ categoryId: '' }))).toEqual([
			{ field: 'categoryId', message: 'errors.ingredients.category' }
		]);
	});

	it('flags an empty name in each language', () => {
		expect(
			fieldsOf(
				buildForm({
					translations: {
						en: { name: ' ', description: '' },
						pt: { name: '', description: '', gender: 'masculine' }
					}
				})
			)
		).toEqual(['translations.en.name', 'translations.pt.name']);
	});

	it('still checks the brand and the unit when another field is wrong', () => {
		expect(
			fieldsOf(buildForm({ categoryId: '', kind: 'branded', brand: '', unitIds: [] })).sort()
		).toEqual(['brand', 'categoryId', 'unitIds']);
	});
});

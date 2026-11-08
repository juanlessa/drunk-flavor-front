import { describe, it, expect, beforeEach } from 'vitest';
import type { IngredientForm } from '~/types/ingredient.types';
import { useIngredientForm } from './useIngredientForm';

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
	requiresNamePlural: false,
	...overrides
});

describe('useIngredientForm', () => {
	let form: ReturnType<typeof useIngredientForm>;
	beforeEach(() => {
		form = useIngredientForm();
	});
	describe('initial state', () => {
		it('starts with empty translations', () => {
			expect(form.formState.value.form.translations.en.name).toBe('');
			expect(form.formState.value.form.translations.pt.name).toBe('');
		});
		it('starts with empty categoryId', () => {
			expect(form.formState.value.form.categoryId).toBe('');
		});
		it('starts as an ingredient of any brand that can be measured, with no units yet', () => {
			expect(form.formState.value.form).toMatchObject({
				kind: 'generic',
				brand: '',
				measurable: true,
				unitIds: []
			});
		});
	});
	describe('updateFormState', () => {
		it('updates all form fields', () => {
			form.updateFormState(buildForm({ kind: 'branded', brand: 'Bacardi' }));
			expect(form.formState.value.form.translations.en.name).toBe('Rum');
			expect(form.formState.value.form.categoryId).toBe('cat-1');
			expect(form.formState.value.form.unitIds).toEqual(['unit-1']);
			expect(form.formState.value.form.kind).toBe('branded');
			expect(form.formState.value.form.brand).toBe('Bacardi');
		});
	});
	describe('state scope', () => {
		it('gives each call its own state, so nothing leaks between component instances', () => {
			form.updateFormState(buildForm());
			const other = useIngredientForm();
			expect(other.formState.value.form.translations.en.name).toBe('');
			expect(other.formState.value.form.categoryId).toBe('');
			expect(other.formState.value.form.unitIds).toEqual([]);
		});
	});
	describe('checkError', () => {
		it('returns empty string when field has no error', () => {
			expect(form.checkError('translations.en.name')).toBe('');
		});
		it('returns translated message when field has error', () => {
			form.formState.value.errors = [{ field: 'translations.en.name', message: 'error.key' }];
			expect(form.checkError('translations.en.name')).toBeTruthy();
		});
	});
	describe('validateForm', () => {
		it('does not validate when displayErrors is false', () => {
			form.validateForm();
			expect(form.formState.value.errors).toEqual([]);
		});
		it('populates errors when form is invalid', () => {
			form.formState.value.displayErrors = true;
			form.validateForm();
			expect(form.formState.value.errors.length).toBeGreaterThan(0);
		});
		it('flags a missing unit', () => {
			form.formState.value.displayErrors = true;
			form.formState.value.form = buildForm({ unitIds: [] });
			form.validateForm();
			expect(form.formState.value.errors.map(({ field }) => field)).toEqual(['unitIds']);
		});
		it('clears errors when form is valid', () => {
			form.formState.value.displayErrors = true;
			form.validateForm();
			form.formState.value.form = buildForm();
			form.validateForm();
			expect(form.formState.value.errors).toEqual([]);
		});
	});
});

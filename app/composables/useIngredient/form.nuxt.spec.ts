import { describe, it, expect, beforeEach } from 'vitest';
import { useIngredientForm } from './form';

describe('useIngredientForm', () => {
	let form: ReturnType<typeof useIngredientForm>;

	beforeEach(() => {
		form = useIngredientForm();
		form.resetFormState();
	});

	describe('initial state', () => {
		it('starts with empty translations', () => {
			expect(form.formState.value.form.translations.en.name).toBe('');
			expect(form.formState.value.form.translations.pt.name).toBe('');
		});

		it('starts with empty categoryId', () => {
			expect(form.formState.value.form.categoryId).toBe('');
		});

		it('starts with empty unitId', () => {
			expect(form.formState.value.form.unitId).toBe('');
		});
	});

	describe('updateFormState', () => {
		it('updates all form fields', () => {
			form.updateFormState({
				translations: {
					en: { name: 'Rum' },
					pt: { name: 'Rum' }
				},
				categoryId: 'cat-1',
				unitId: 'unit-1'
			});

			expect(form.formState.value.form.translations.en.name).toBe('Rum');
			expect(form.formState.value.form.categoryId).toBe('cat-1');
			expect(form.formState.value.form.unitId).toBe('unit-1');
		});
	});

	describe('resetFormState', () => {
		it('resets form and flags to initial state', () => {
			form.updateFormState({
				translations: {
					en: { name: 'Rum' },
					pt: { name: 'Rum' }
				},
				categoryId: 'cat-1',
				unitId: 'unit-1'
			});

			form.resetFormState();

			expect(form.formState.value.form.translations.en.name).toBe('');
			expect(form.formState.value.form.categoryId).toBe('');
			expect(form.formState.value.form.unitId).toBe('');
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

		it('flags a missing unitId', () => {
			form.formState.value.displayErrors = true;
			form.formState.value.form = {
				translations: {
					en: { name: 'Rum' },
					pt: { name: 'Rum' }
				},
				categoryId: 'cat-1',
				unitId: ''
			};

			form.validateForm();

			expect(form.formState.value.errors.map(({ field }) => field)).toEqual(['unitId']);
		});

		it('clears errors when form is valid', () => {
			form.formState.value.displayErrors = true;
			form.validateForm();

			form.formState.value.form = {
				translations: {
					en: { name: 'Rum' },
					pt: { name: 'Rum' }
				},
				categoryId: 'cat-1',
				unitId: 'unit-1'
			};
			form.validateForm();

			expect(form.formState.value.errors).toEqual([]);
		});
	});
});

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

		it('starts with empty category_id', () => {
			expect(form.formState.value.form.category_id).toBe('');
		});

		it('starts with empty unit_id', () => {
			expect(form.formState.value.form.unit_id).toBe('');
		});
	});

	describe('updateFormState', () => {
		it('updates all form fields', () => {
			form.updateFormState({
				translations: {
					en: { name: 'Rum' },
					pt: { name: 'Rum' }
				},
				category_id: 'cat-1',
				unit_id: 'unit-1'
			});

			expect(form.formState.value.form.translations.en.name).toBe('Rum');
			expect(form.formState.value.form.category_id).toBe('cat-1');
			expect(form.formState.value.form.unit_id).toBe('unit-1');
		});
	});

	describe('resetFormState', () => {
		it('resets form and flags to initial state', () => {
			form.updateFormState({
				translations: {
					en: { name: 'Rum' },
					pt: { name: 'Rum' }
				},
				category_id: 'cat-1',
				unit_id: 'unit-1'
			});

			form.resetFormState();

			expect(form.formState.value.form.translations.en.name).toBe('');
			expect(form.formState.value.form.category_id).toBe('');
			expect(form.formState.value.form.unit_id).toBe('');
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

		it('flags a missing unit_id', () => {
			form.formState.value.displayErrors = true;
			form.formState.value.form = {
				translations: {
					en: { name: 'Rum' },
					pt: { name: 'Rum' }
				},
				category_id: 'cat-1',
				unit_id: ''
			};

			form.validateForm();

			expect(form.formState.value.errors.map(({ field }) => field)).toEqual(['unit_id']);
		});

		it('clears errors when form is valid', () => {
			form.formState.value.displayErrors = true;
			form.validateForm();

			form.formState.value.form = {
				translations: {
					en: { name: 'Rum' },
					pt: { name: 'Rum' }
				},
				category_id: 'cat-1',
				unit_id: 'unit-1'
			};
			form.validateForm();

			expect(form.formState.value.errors).toEqual([]);
		});
	});
});

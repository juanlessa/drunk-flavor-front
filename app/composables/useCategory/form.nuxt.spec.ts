import { describe, it, expect, beforeEach } from 'vitest';
import { useCategoryForm } from './form';

describe('useCategoryForm', () => {
	let form: ReturnType<typeof useCategoryForm>;

	beforeEach(() => {
		form = useCategoryForm();
		form.resetFormState();
	});

	describe('initial state', () => {
		it('starts with empty translations', () => {
			expect(form.formState.value.form.translations.en.name).toBe('');
			expect(form.formState.value.form.translations.pt.name).toBe('');
		});

		it('starts with no errors', () => {
			expect(form.formState.value.errors).toEqual([]);
		});

		it('starts with displayErrors false', () => {
			expect(form.formState.value.displayErrors).toBe(false);
		});
	});

	describe('updateFormState', () => {
		it('updates the form translations', () => {
			form.updateFormState({
				translations: { en: { name: 'Juice' }, pt: { name: 'Suco' } }
			});

			expect(form.formState.value.form.translations.en.name).toBe('Juice');
			expect(form.formState.value.form.translations.pt.name).toBe('Suco');
		});
	});

	describe('resetFormState', () => {
		it('resets form and flags to initial state', () => {
			form.updateFormState({
				translations: { en: { name: 'Juice' }, pt: { name: 'Suco' } }
			});
			form.formState.value.displayErrors = true;

			form.resetFormState();

			expect(form.formState.value.form.translations.en.name).toBe('');
			expect(form.formState.value.displayErrors).toBe(false);
			expect(form.formState.value.errors).toEqual([]);
		});
	});

	describe('checkError', () => {
		it('returns empty string when field has no error', () => {
			expect(form.checkError('translations.en.name')).toBe('');
		});

		it('returns translated message when field has error', () => {
			form.formState.value.errors = [
				{ field: 'translations.en.name', message: 'error.key' }
			];

			const result = form.checkError('translations.en.name');

			expect(result).toBeTruthy();
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

		it('clears errors when form becomes valid', () => {
			form.formState.value.displayErrors = true;
			form.validateForm();

			form.formState.value.form.translations.en.name = 'Valid';
			form.formState.value.form.translations.pt.name = 'Válido';
			form.validateForm();

			expect(form.formState.value.errors).toEqual([]);
		});
	});
});

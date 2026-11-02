import { describe, it, expect, beforeEach } from 'vitest';
import { useDrinkForm } from './form';

describe('useDrinkForm', () => {
	let form: ReturnType<typeof useDrinkForm>;

	beforeEach(() => {
		form = useDrinkForm();
		form.resetFormState();
	});

	describe('initial state', () => {
		it('starts with empty translations', () => {
			expect(form.formState.value.form.translations.en.name).toBe('');
			expect(form.formState.value.form.translations.en.method).toBe('');
		});

		it('starts with empty ingredients', () => {
			expect(form.formState.value.form.ingredients).toEqual([]);
		});

		it('starts with no cover or thumbnail', () => {
			expect(form.formState.value.cover).toBeUndefined();
			expect(form.formState.value.thumbnail).toBeUndefined();
		});

		it('starts with displayErrors false', () => {
			expect(form.formState.value.displayErrors).toBe(false);
		});
	});

	describe('updateFormState', () => {
		it('updates translations and ingredients', () => {
			form.updateFormState({
				translations: {
					en: { name: 'Mojito', method: 'Muddle mint' },
					pt: { name: 'Mojito', method: 'Macere hortelã' }
				},
				ingredients: [{ ingredientId: 'ing-1', quantity: 60 }]
			});

			expect(form.formState.value.form.translations.en.name).toBe('Mojito');
			expect(form.formState.value.form.ingredients).toHaveLength(1);
		});
	});

	describe('resetFormState', () => {
		it('resets form and flags to initial state', () => {
			form.updateFormState({
				translations: {
					en: { name: 'Mojito', method: 'Mix' },
					pt: { name: 'Mojito', method: 'Misture' }
				},
				ingredients: [{ ingredientId: 'ing-1', quantity: 60 }]
			});
			form.formState.value.displayErrors = true;

			form.resetFormState();

			expect(form.formState.value.form.translations.en.name).toBe('');
			expect(form.formState.value.form.ingredients).toEqual([]);
			expect(form.formState.value.displayErrors).toBe(false);
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

		it('clears errors when form becomes valid', () => {
			form.formState.value.displayErrors = true;
			form.validateForm();

			form.formState.value.form.translations.en = { name: 'Drink', method: 'Mix it' };
			form.formState.value.form.translations.pt = { name: 'Drink', method: 'Misture' };
			form.formState.value.form.ingredients = [{ ingredientId: 'ing-1', quantity: 1 }];
			form.validateForm();

			expect(form.formState.value.errors).toEqual([]);
		});
	});
});

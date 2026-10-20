import { describe, it, expect, beforeEach } from 'vitest';
import { useSignupForm } from './useSignup';

describe('useSignupForm', () => {
	let form: ReturnType<typeof useSignupForm>;

	beforeEach(() => {
		form = useSignupForm();
		form.resetFormState();
	});

	describe('initial state', () => {
		it('starts with empty fields including confirmPassword', () => {
			expect(form.formState.value.form.name).toBe('');
			expect(form.formState.value.form.surname).toBe('');
			expect(form.formState.value.form.email).toBe('');
			expect(form.formState.value.form.password).toBe('');
			expect(form.formState.value.form.confirmPassword).toBe('');
		});

		it('starts with no errors', () => {
			expect(form.formState.value.errors).toEqual([]);
		});

		it('starts with displayErrors false', () => {
			expect(form.formState.value.displayErrors).toBe(false);
		});
	});

	describe('resetFormState', () => {
		it('resets form and flags to initial state', () => {
			form.formState.value.form.name = 'Jane';
			form.formState.value.form.password = 'Password123!';
			form.formState.value.form.confirmPassword = 'Password123!';
			form.formState.value.displayErrors = true;

			form.resetFormState();

			expect(form.formState.value.form.name).toBe('');
			expect(form.formState.value.form.password).toBe('');
			expect(form.formState.value.form.confirmPassword).toBe('');
			expect(form.formState.value.displayErrors).toBe(false);
		});
	});

	describe('checkError', () => {
		it('returns empty string when field has no error', () => {
			expect(form.checkError('password')).toBe('');
		});

		it('returns translated message when field has error', () => {
			form.formState.value.errors = [
				{ field: 'confirmPassword', message: 'errors.auth.passwordsMismatch' }
			];

			expect(form.checkError('confirmPassword')).toBeTruthy();
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

		it('reports a confirmPassword error when passwords do not match', () => {
			form.formState.value.displayErrors = true;
			form.formState.value.form.name = 'Jane';
			form.formState.value.form.surname = 'Doe';
			form.formState.value.form.email = 'jane@example.com';
			form.formState.value.form.password = 'Password123!';
			form.formState.value.form.confirmPassword = 'Password456!';

			form.validateForm();

			const mismatch = form.formState.value.errors.find(
				(err) => err.field === 'confirmPassword'
			);
			expect(mismatch).toBeTruthy();
		});

		it('clears errors when form is valid and passwords match', () => {
			form.formState.value.displayErrors = true;
			form.validateForm();

			form.formState.value.form.name = 'Jane';
			form.formState.value.form.surname = 'Doe';
			form.formState.value.form.email = 'jane@example.com';
			form.formState.value.form.password = 'Password123!';
			form.formState.value.form.confirmPassword = 'Password123!';
			form.validateForm();

			expect(form.formState.value.errors).toEqual([]);
		});
	});
});

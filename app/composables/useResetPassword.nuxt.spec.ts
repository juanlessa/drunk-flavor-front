import { describe, it, expect, beforeEach } from 'vitest';
import { useResetPasswordForm } from './useResetPassword';

describe('useResetPasswordForm', () => {
	let form: ReturnType<typeof useResetPasswordForm>;

	beforeEach(() => {
		form = useResetPasswordForm();
		form.resetFormState();
	});

	describe('initial state', () => {
		it('starts with empty password and confirmPassword', () => {
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
			form.formState.value.form.password = 'Password123!';
			form.formState.value.form.confirmPassword = 'Password123!';
			form.formState.value.displayErrors = true;

			form.resetFormState();

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
			form.formState.value.form.password = 'Password123!';
			form.formState.value.form.confirmPassword = 'Password456!';

			form.validateForm();

			const mismatch = form.formState.value.errors.find(
				(err) => err.field === 'confirmPassword'
			);
			expect(mismatch).toBeTruthy();
		});

		it('clears errors when form becomes valid', () => {
			form.formState.value.displayErrors = true;
			form.validateForm();

			form.formState.value.form.password = 'Password123!';
			form.formState.value.form.confirmPassword = 'Password123!';
			form.validateForm();

			expect(form.formState.value.errors).toEqual([]);
		});
	});
});

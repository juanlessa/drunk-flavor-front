import { describe, it, expect, beforeEach } from 'vitest';
import { useLoginForm } from './useLogin';

describe('useLoginForm', () => {
	let form: ReturnType<typeof useLoginForm>;

	beforeEach(() => {
		form = useLoginForm();
		form.resetFormState();
	});

	describe('initial state', () => {
		it('starts with empty email and password', () => {
			expect(form.formState.value.form.email).toBe('');
			expect(form.formState.value.form.password).toBe('');
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
			form.formState.value.form.email = 'test@test.com';
			form.formState.value.form.password = 'password123';
			form.formState.value.displayErrors = true;

			form.resetFormState();

			expect(form.formState.value.form.email).toBe('');
			expect(form.formState.value.form.password).toBe('');
			expect(form.formState.value.displayErrors).toBe(false);
		});
	});

	describe('checkError', () => {
		it('returns empty string when field has no error', () => {
			expect(form.checkError('email')).toBe('');
		});

		it('returns translated message when field has error', () => {
			form.formState.value.errors = [
				{ field: 'email', message: 'errors.users.email' }
			];

			expect(form.checkError('email')).toBeTruthy();
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

			form.formState.value.form.email = 'valid@test.com';
			form.formState.value.form.password = 'password123';
			form.validateForm();

			expect(form.formState.value.errors).toEqual([]);
		});
	});
});

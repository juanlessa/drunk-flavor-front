import { describe, it, expect } from 'vitest';
import { checkFieldError } from './checkFieldError';
import type { FieldError } from '~/types/form';

describe('checkFieldError', () => {
	const errors: FieldError[] = [
		{ field: 'name', message: 'Name is required' },
		{ field: 'email', message: 'Invalid email' },
		{ field: 'translations.en.name', message: 'English name is required' }
	];

	it('returns the error message when field exists in errors', () => {
		const result = checkFieldError(errors, 'name');

		expect(result).toBe('Name is required');
	});

	it('returns empty string when field does not exist in errors', () => {
		const result = checkFieldError(errors, 'password');

		expect(result).toBe('');
	});

	it('returns empty string when errors array is empty', () => {
		const result = checkFieldError([], 'name');

		expect(result).toBe('');
	});

	it('handles nested field paths', () => {
		const result = checkFieldError(errors, 'translations.en.name');

		expect(result).toBe('English name is required');
	});

	it('returns the first matching error when duplicates exist', () => {
		const duplicateErrors: FieldError[] = [
			{ field: 'name', message: 'First error' },
			{ field: 'name', message: 'Second error' }
		];
		const result = checkFieldError(duplicateErrors, 'name');

		expect(result).toBe('First error');
	});
});

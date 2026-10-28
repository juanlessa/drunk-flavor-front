import { describe, expect, it } from 'vitest';
import {
	createPasswordFormValidator,
	profileDetailsFormValidator,
	updatePasswordFormValidator
} from './profile';

describe('profile validations', () => {
	it('accepts valid profile details', () => {
		expect(profileDetailsFormValidator({ name: 'Juan', surname: 'Lessa' })).toEqual([]);
	});

	it('requires both profile names', () => {
		const errors = profileDetailsFormValidator({ name: '', surname: '' });

		expect(errors.map((error) => error.field)).toEqual(['name', 'surname']);
	});

	it('accepts valid create-password data', () => {
		expect(
			createPasswordFormValidator({
				newPassword: 'Strong-password-123',
				confirmPassword: 'Strong-password-123'
			})
		).toEqual([]);
	});

	it('rejects mismatched create-password confirmation', () => {
		const errors = createPasswordFormValidator({
			newPassword: 'Strong-password-123',
			confirmPassword: 'Different-password-123'
		});
		expect(errors.map((error) => error.field)).toContain('confirmPassword');
	});

	it('accepts a valid password update', () => {
		const password = 'Strong-password-123';
		expect(
			updatePasswordFormValidator({
				currentPassword: 'Current-password-123',
				newPassword: password,
				confirmPassword: password
			})
		).toEqual([]);
	});

	it('requires the current password and matching new passwords', () => {
		const errors = updatePasswordFormValidator({
			currentPassword: '',
			newPassword: 'Strong-password-123',
			confirmPassword: 'Different-password-123'
		});

		expect(errors.map((error) => error.field)).toContain('currentPassword');
		expect(errors.map((error) => error.field)).toContain('confirmPassword');
	});
});

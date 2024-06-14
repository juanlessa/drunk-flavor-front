import { z } from 'zod';

// fields validation
export const userNameValidation = z
	.string()
	.trim()
	.min(1, { message: 'USER_ERRORS.invalid_name_format' });

export const userSurnameValidation = z
	.string()
	.trim()
	.min(1, { message: 'USER_ERRORS.required_surname' });

export const userEmailValidation = z
	.string()
	.email({ message: 'USER_ERRORS.invalid_email_format' });

export const userPasswordValidation = z
	.string()
	.min(8, { message: 'USER_ERRORS.invalid_password_format' });

export const userRoleValidation = z
	.string()
	.trim()
	.min(1, { message: 'USER_ERRORS.invalid_role_format' });

// schemas

//validators

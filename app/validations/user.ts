import { z } from 'zod/v4';

// fields validation
export const userNameValidation = z.string().trim().min(1, { error: 'errors.users.name' });

export const userSurnameValidation = z.string().trim().min(1, { error: 'errors.users.surname' });

export const userEmailValidation = z.email({ error: 'errors.users.email' });

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-{}\[\]:;"'<>,.?/~`]).{8,64}$/;
export const userPasswordValidation = z
	.string()
	.min(8, { error: 'errors.users.passwordMinSize' })
	.max(64, { error: 'errors.users.passwordMaxSize' })
	.regex(passwordPattern, { error: 'errors.users.weakPassword' });

export const userRoleValidation = z.string().trim().min(1, { error: 'errors.users.role' });

// schemas

//validators

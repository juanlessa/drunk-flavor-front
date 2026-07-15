import { z } from 'zod/v4';

// fields validation
export const userNameValidation = z.string().trim().min(1, { error: 'errors.users.name' });

export const userSurnameValidation = z.string().trim().min(1, { error: 'errors.users.surname' });

export const userEmailValidation = z.string().email({ error: 'errors.users.email' });

export const userPasswordValidation = z.string().min(8, { error: 'errors.users.password' });

export const userRoleValidation = z.string().trim().min(1, { error: 'errors.users.role' });

// schemas

//validators

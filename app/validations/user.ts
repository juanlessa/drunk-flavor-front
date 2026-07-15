import { z } from 'zod';

// fields validation
export const userNameValidation = z.string().trim().min(1, { message: 'errors.users.name' });

export const userSurnameValidation = z.string().trim().min(1, { message: 'errors.users.surname' });

export const userEmailValidation = z.string().email({ message: 'errors.users.email' });

export const userPasswordValidation = z.string().min(8, { message: 'errors.users.password' });

export const userRoleValidation = z.string().trim().min(1, { message: 'errors.users.role' });

// schemas

//validators

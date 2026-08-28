import { z } from 'zod/v4';
import { validateSchema } from '~/helpers/validateSchema';
import { userEmailValidation, userNameValidation, userPasswordValidation, userSurnameValidation } from './user';
import type { ForgotPasswordForm, LoginForm, SignupForm } from '~/types/auth.types';

// schemas
export const loginFormSchema = z.object({
	email: userEmailValidation,
	password: userPasswordValidation
});

export const signupFormSchema = z.object({
	name: userNameValidation,
	surname: userSurnameValidation,
	email: userEmailValidation,
	password: userPasswordValidation
});

export const forgotPasswordFormSchema = z.object({
	email: userEmailValidation
});

//validators
export const loginFormValidator = validateSchema<LoginForm>(loginFormSchema);
export const signupFormValidator = validateSchema<SignupForm>(signupFormSchema);
export const forgotPasswordFormValidator = validateSchema<ForgotPasswordForm>(forgotPasswordFormSchema);

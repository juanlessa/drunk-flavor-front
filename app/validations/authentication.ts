import { z } from 'zod/v4';
import { validateSchema } from '~/helpers/validateSchema';
import {
	userEmailValidation,
	userNameValidation,
	userPasswordValidation,
	userSurnameValidation
} from './user';
import type {
	CompleteProfileForm,
	ForgotPasswordForm,
	ResetPasswordForm,
	SigninForm,
	SignupForm
} from '~/types/auth.types';

// schemas
export const signinFormSchema = z.object({
	email: userEmailValidation,
	password: userPasswordValidation
});

export const signupFormSchema = z
	.object({
		name: userNameValidation,
		surname: userSurnameValidation,
		email: userEmailValidation,
		password: userPasswordValidation,
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: 'errors.auth.passwordsMismatch',
		path: ['confirmPassword']
	});

export const completeProfileFormSchema = z.object({
	name: userNameValidation,
	surname: userSurnameValidation
});

export const forgotPasswordFormSchema = z.object({
	email: userEmailValidation
});

export const resetPasswordFormSchema = z
	.object({
		password: userPasswordValidation,
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: 'errors.auth.passwordsMismatch',
		path: ['confirmPassword']
	});

//validators
export const signinFormValidator = validateSchema<SigninForm>(signinFormSchema);
export const signupFormValidator = validateSchema<SignupForm>(signupFormSchema);
export const completeProfileFormValidator =
	validateSchema<CompleteProfileForm>(completeProfileFormSchema);
export const forgotPasswordFormValidator =
	validateSchema<ForgotPasswordForm>(forgotPasswordFormSchema);
export const resetPasswordFormValidator =
	validateSchema<ResetPasswordForm>(resetPasswordFormSchema);

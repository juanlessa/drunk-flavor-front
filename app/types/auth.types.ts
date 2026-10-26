import type { FieldError } from './form.types';
import type { Profile } from '../domain/profile/profile.entity';

export type SigninForm = {
	email: string;
	password: string;
};

export type SigninFormState = {
	form: SigninForm;
	errors: FieldError[];
	displayErrors: boolean;
};

export type SignupForm = {
	name: string;
	surname: string;
	email: string;
	password: string;
	confirmPassword: string;
};

export type SignupFormState = {
	form: SignupForm;
	errors: FieldError[];
	displayErrors: boolean;
};

export type ForgotPasswordForm = {
	email: string;
};

export type ForgotPasswordFormState = {
	form: ForgotPasswordForm;
	errors: FieldError[];
	displayErrors: boolean;
};

export type ResetPasswordForm = {
	password: string;
	confirmPassword: string;
};

export type ResetPasswordFormState = {
	form: ResetPasswordForm;
	errors: FieldError[];
	displayErrors: boolean;
};

export type CompleteProfileForm = {
	name: string;
	surname: string;
};

export type CompleteProfileFormState = {
	form: CompleteProfileForm;
	errors: FieldError[];
	displayErrors: boolean;
};

export type AuthState = {
	user: Profile | undefined;
	isAuthenticated: boolean;
};

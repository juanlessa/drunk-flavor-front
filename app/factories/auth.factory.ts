import type {
	SigninForm,
	SignupForm,
	ForgotPasswordForm,
	ResetPasswordForm,
	CompleteProfileForm
} from '../types/auth.types';

export const initEmptySigninForm = (): SigninForm => ({
	email: '',
	password: ''
});

export const initEmptySignupForm = (): SignupForm => ({
	name: '',
	surname: '',
	email: '',
	password: '',
	confirmPassword: ''
});

export const initEmptyCompleteProfileForm = (): CompleteProfileForm => ({
	name: '',
	surname: ''
});

export const initEmptyForgotPasswordForm = (): ForgotPasswordForm => ({
	email: ''
});

export const initEmptyResetPasswordForm = (): ResetPasswordForm => ({
	password: '',
	confirmPassword: ''
});

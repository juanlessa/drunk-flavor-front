import type { SigninForm, SignupForm, ForgotPasswordForm } from '../types/auth.types';

export const initEmptySigninForm = (): SigninForm => ({
	email: '',
	password: ''
});

export const initEmptySignupForm = (): SignupForm => ({
	name: '',
	surname: '',
	email: '',
	password: ''
});

export const initEmptyForgotPasswordForm = (): ForgotPasswordForm => ({
	email: ''
});

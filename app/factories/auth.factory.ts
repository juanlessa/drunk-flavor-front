import type { LoginForm, SignupForm, ForgotPasswordForm } from '../types/auth.types';

export const initEmptyLoginForm = (): LoginForm => ({
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

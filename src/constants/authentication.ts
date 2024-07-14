import type { LoginForm } from '@/types/authentication';

export const AUTH_TOKEN_NAME = 'Authorization';
export const SESSION_TOKEN_NAME = 'session';

export const initEmptyLoginForm = (): LoginForm => ({
	email: '',
	password: ''
});

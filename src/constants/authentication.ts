import type { LoginForm } from '@/types/authentication';

export const AUTH_TOKEN_NAME = 'authorization';
export const SESSION_TOKEN_NAME = 'refreshToken';

export const initEmptyLoginForm = (): LoginForm => ({
	email: '',
	password: ''
});

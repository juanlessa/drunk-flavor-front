import type { LoginForm } from '../types/auth.types';

export const initEmptyLoginForm = (): LoginForm => ({
	email: '',
	password: ''
});

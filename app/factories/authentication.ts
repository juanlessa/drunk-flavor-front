import type { LoginForm } from '~/types/authentication';

export const initEmptyLoginForm = (): LoginForm => ({
	email: '',
	password: ''
});

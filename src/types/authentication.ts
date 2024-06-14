import type { FieldError } from '~/types/form';
import type { IUserProfile } from './user';

export type ILogin = {
	email: string;
	password: string;
};

export type LoginForm = {
	email: string;
	password: string;
};

export type LoginFormState = {
	form: LoginForm;
	errors: FieldError[];
	displayErrors: boolean;
};

export type AuthState = {
	user: IUserProfile | undefined;
	isAuthenticated: boolean;
};

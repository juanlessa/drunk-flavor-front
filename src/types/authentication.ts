import type { FieldError } from '~/types/form';

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

import type { FieldError } from '~/types/form';
import type { Profile } from './profile';

export type Signup = {
	name: string;
	surname: string;
	email: string;
	password: string;
};

export type Login = {
	email: string;
	password: string;
};

export type ForgotPassword = {
	email: string;
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
	user: Profile | undefined;
	isAuthenticated: boolean;
};

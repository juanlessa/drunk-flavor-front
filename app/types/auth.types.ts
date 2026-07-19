import type { FieldError } from './form.types';
import type { Profile } from '../domain/profile/profile.entity';

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

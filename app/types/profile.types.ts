import type { FieldError } from './form.types';

export type ProfileDetailsForm = {
	name: string;
	surname: string;
};

export type ProfileDetailsFormState = {
	form: ProfileDetailsForm;
	errors: FieldError[];
	displayErrors: boolean;
};

export type CreatePasswordForm = {
	newPassword: string;
	confirmPassword: string;
};

export type CreatePasswordFormState = {
	form: CreatePasswordForm;
	errors: FieldError[];
	displayErrors: boolean;
};

export type UpdatePasswordForm = {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
};

export type UpdatePasswordFormState = {
	form: UpdatePasswordForm;
	errors: FieldError[];
	displayErrors: boolean;
};

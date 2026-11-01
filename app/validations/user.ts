import { z } from 'zod/v4';
import {
	nonOwnerRoles,
	USER_ADMINISTRATION_REASON_MAX_LENGTH,
	USER_ADMINISTRATION_REASON_MIN_LENGTH
} from '~/domain/user/user.constants';
import { validateSchema } from '~/helpers/validateSchema';
import type { ChangeUserRoleForm, UserAdministrationReasonForm } from '~/types/user.types';

// fields validation
export const userNameValidation = z.string().trim().min(1, { error: 'errors.users.name' });

export const userSurnameValidation = z.string().trim().min(1, { error: 'errors.users.surname' });

export const userEmailValidation = z.email({ error: 'errors.users.email' });

const passwordPattern =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-{}[\]:;"'<>,.?/~`]).{8,64}$/;
export const userPasswordValidation = z
	.string()
	.min(8, { error: 'errors.users.passwordMinSize' })
	.max(64, { error: 'errors.users.passwordMaxSize' })
	.regex(passwordPattern, { error: 'errors.users.weakPassword' });

export const userRoleValidation = z.string().trim().min(1, { error: 'errors.users.role' });

export const userAdministrationRoleValidation = z.enum(nonOwnerRoles, {
	error: 'errors.users.role'
});

// Mirrors the backend rule shared by user administration actions and ownership transfer requests.
export const userAdministrationReasonValidation = z
	.string()
	.trim()
	.min(USER_ADMINISTRATION_REASON_MIN_LENGTH, {
		error: 'errors.users.administrationReasonMinSize'
	})
	.max(USER_ADMINISTRATION_REASON_MAX_LENGTH, {
		error: 'errors.users.administrationReasonMaxSize'
	});

// schemas
export const userAdministrationReasonFormSchema = z.object({
	reason: userAdministrationReasonValidation
});

export const changeUserRoleFormSchema = z.object({
	role: userAdministrationRoleValidation
});

//validators
export const userAdministrationReasonFormValidator = validateSchema<UserAdministrationReasonForm>(
	userAdministrationReasonFormSchema
);
export const changeUserRoleFormValidator =
	validateSchema<ChangeUserRoleForm>(changeUserRoleFormSchema);

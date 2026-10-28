import { z } from 'zod/v4';
import { validateSchema } from '~/helpers/validateSchema';
import type {
	CreatePasswordForm,
	ProfileDetailsForm,
	UpdatePasswordForm
} from '~/types/profile.types';
import { userNameValidation, userPasswordValidation, userSurnameValidation } from './user';

export const profileDetailsFormSchema = z.object({
	name: userNameValidation,
	surname: userSurnameValidation
});

export const createPasswordFormSchema = z
	.object({
		newPassword: userPasswordValidation,
		confirmPassword: z.string()
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		error: 'errors.auth.passwordsMismatch',
		path: ['confirmPassword']
	});

export const updatePasswordFormSchema = z
	.object({
		currentPassword: z.string().min(1, { error: 'errors.users.currentPassword' }),
		newPassword: userPasswordValidation,
		confirmPassword: z.string()
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		error: 'errors.auth.passwordsMismatch',
		path: ['confirmPassword']
	});

export const profileDetailsFormValidator =
	validateSchema<ProfileDetailsForm>(profileDetailsFormSchema);
export const createPasswordFormValidator =
	validateSchema<CreatePasswordForm>(createPasswordFormSchema);
export const updatePasswordFormValidator =
	validateSchema<UpdatePasswordForm>(updatePasswordFormSchema);

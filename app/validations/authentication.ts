import { z } from 'zod';
import { validateSchema } from '~/helpers/validateSchema';
import { userEmailValidation, userPasswordValidation } from './user';
import type { LoginForm } from '~/types/authentication';

// schemas
export const loginFormSchema = z.object({
	email: userEmailValidation,
	password: userPasswordValidation
});

//validators
export const loginFormValidator = validateSchema<LoginForm>(loginFormSchema);

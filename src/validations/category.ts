import { z } from 'zod';
import { getZodTranslationsSchema } from '~/helpers/getZodTranslationsSchema';
import { validateSchema } from '~/helpers/validateSchema';
import type { CategoryForm } from '@/types/category';

// fields validation
export const categoryNameValidation = z
	.string()
	.trim()
	.min(1, { message: 'organisms.categoryForm.nameInput.error' });

// schemas
export const categoryTranslationSchema = z.object({
	name: categoryNameValidation
});

export const categoryFormSchema = z.object({
	translations: getZodTranslationsSchema(categoryTranslationSchema)
});

//validators
export const categoryFormValidator = validateSchema<CategoryForm>(categoryFormSchema);

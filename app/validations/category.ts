import { z } from 'zod/v4';
import { getZodTranslationsSchema } from '~/helpers/getZodTranslationsSchema';
import { validateSchema } from '~/helpers/validateSchema';
import type { CategoryForm } from '~/types/category.types';

// fields validation
export const categoryNameValidation = z.string().trim().min(1, { error: 'errors.categories.name' });

export const categoryIsAlcoholicValidation = z.boolean();

// schemas
export const categoryTranslationSchema = z.object({
	name: categoryNameValidation
});

export const categoryFormSchema = z.object({
	translations: getZodTranslationsSchema(categoryTranslationSchema),
	isAlcoholic: categoryIsAlcoholicValidation
});

//validators
export const categoryFormValidator = validateSchema<CategoryForm>(categoryFormSchema);

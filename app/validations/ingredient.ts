import { z } from 'zod/v4';
import { getZodTranslationsSchema } from '~/helpers/getZodTranslationsSchema';
import { validateSchema } from '~/helpers/validateSchema';
import type { IngredientForm } from '~/types/ingredient.types';

// fields validation
export const ingredientNameValidation = z
	.string()
	.trim()
	.min(1, { error: 'errors.ingredients.name' });

export const ingredientCategoryIdValidation = z
	.string()
	.min(1, { error: 'errors.ingredients.category' });

export const ingredientUnitIdValidation = z.string().min(1, { error: 'errors.ingredients.unit' });

// schemas
export const ingredientTranslationSchema = z.object({
	name: ingredientNameValidation
});

export const ingredientFormSchema = z.object({
	translations: getZodTranslationsSchema(ingredientTranslationSchema),
	category_id: ingredientCategoryIdValidation,
	unit_id: ingredientUnitIdValidation
});

//validators
export const ingredientFormValidator = validateSchema<IngredientForm>(ingredientFormSchema);

import { z } from 'zod/v4';
import { Genders } from '~/domain/shared/gender.constants';
import { getZodGenderedTranslationsSchema } from '~/helpers/getZodTranslationsSchema';
import { validateSchema } from '~/helpers/validateSchema';
import type { IngredientForm } from '~/types/ingredient.types';

// fields validation
export const ingredientNameValidation = z
	.string()
	.trim()
	.min(1, { error: 'errors.ingredients.name' });

export const ingredientGenderValidation = z.enum(Genders, {
	error: 'errors.ingredients.gender'
});
export const ingredientCategoryIdValidation = z
	.string()
	.min(1, { error: 'errors.ingredients.category' });

export const ingredientUnitIdsValidation = z
	.array(z.string().min(1))
	.min(1, { error: 'errors.ingredients.unit' });

// schemas
export const ingredientTranslationSchema = z.object({
	name: ingredientNameValidation
});

export const ingredientFormSchema = z.object({
	translations: getZodGenderedTranslationsSchema(
		ingredientTranslationSchema,
		ingredientGenderValidation
	),
	categoryId: ingredientCategoryIdValidation,
	unitIds: ingredientUnitIdsValidation
});

//validators
export const ingredientFormValidator = validateSchema<IngredientForm>(ingredientFormSchema);

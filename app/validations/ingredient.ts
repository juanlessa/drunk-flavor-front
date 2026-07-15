import { z } from 'zod/v4';
import { getZodTranslationsSchema } from '~/helpers/getZodTranslationsSchema';
import { validateSchema } from '~/helpers/validateSchema';
import type { IngredientForm } from '~/types/ingredient';

// fields validation
export const ingredientNameValidation = z
	.string()
	.trim()
	.min(1, { error: 'errors.ingredients.name' });

export const ingredientUnitValidation = z
	.string()
	.trim()
	.min(1, { error: 'errors.ingredients.unit' });

export const ingredientUnitPluralValidation = z
	.string()
	.trim()
	.min(1, { error: 'errors.ingredients.unitPlural' });

export const ingredientCategoryIdValidation = z
	.string()
	.min(1, { error: 'errors.ingredient.category' });

export const ingredientIsAlcoholicValidation = z.boolean();

// schemas
export const ingredientTranslationSchema = z.object({
	name: ingredientNameValidation,
	unit: ingredientUnitValidation,
	unit_plural: ingredientUnitPluralValidation
});

export const ingredientFormSchema = z.object({
	translations: getZodTranslationsSchema(ingredientTranslationSchema),
	is_alcoholic: ingredientIsAlcoholicValidation,
	category_id: ingredientCategoryIdValidation
});

//validators
export const ingredientFormValidator = validateSchema<IngredientForm>(ingredientFormSchema);

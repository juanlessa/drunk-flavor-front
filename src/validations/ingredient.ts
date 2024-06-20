import { z } from 'zod';
import { getZodTranslationsSchema } from '~/helpers/getZodTranslationsSchema';
import { validateSchema } from '~/helpers/validateSchema';
import type { IngredientForm } from '~/types/ingredient';

// fields validation
export const ingredientNameValidation = z
	.string()
	.trim()
	.min(1, { message: 'ingredientForm.nameInput.errorInvalidFormat' });

export const ingredientUnitValidation = z
	.string()
	.trim()
	.min(1, { message: 'ingredientForm.unitInput.errorInvalidFormat' });

export const ingredientUnitPluralValidation = z
	.string()
	.trim()
	.min(1, { message: 'ingredientForm.unitPluralInput.errorInvalidFormat' });

export const ingredientCategoryIdValidation = z
	.string()
	.min(1, { message: 'INGREDIENT_ERRORS.invalid_category_format' });

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

import { z } from 'zod/v4';
import {
	INGREDIENT_BRAND_MAX_LENGTH,
	INGREDIENT_DESCRIPTION_MAX_LENGTH,
	IngredientKinds
} from '~/domain/ingredient/ingredient.constants';
import { Genders } from '~/domain/shared/gender.constants';
import { getZodGenderedTranslationsSchema } from '~/helpers/getZodTranslationsSchema';
import { validateSchema } from '~/helpers/validateSchema';
import type { IngredientForm } from '~/types/ingredient.types';
// fields validation
export const ingredientNameValidation = z
	.string()
	.trim()
	.min(1, { error: 'errors.ingredients.name' });
export const ingredientDescriptionValidation = z
	.string()
	.trim()
	.max(INGREDIENT_DESCRIPTION_MAX_LENGTH, { error: 'errors.ingredients.description' });
export const ingredientGenderValidation = z.enum(Genders, {
	error: 'errors.ingredients.gender'
});
export const ingredientCategoryIdValidation = z
	.string()
	.min(1, { error: 'errors.ingredients.category' });
export const ingredientKindValidation = z.enum(IngredientKinds);
export const ingredientBrandValidation = z
	.string()
	.trim()
	.min(1, { error: 'errors.ingredients.brand' })
	.max(INGREDIENT_BRAND_MAX_LENGTH, { error: 'errors.ingredients.brand' });
// schemas
export const ingredientTranslationSchema = z.object({
	name: ingredientNameValidation,
	description: ingredientDescriptionValidation.optional()
});
export const ingredientFormSchema = z
	.object({
		translations: getZodGenderedTranslationsSchema(
			ingredientTranslationSchema,
			ingredientGenderValidation
		),
		categoryId: ingredientCategoryIdValidation,
		kind: ingredientKindValidation,
		brand: z.string(),
		measurable: z.boolean(),
		unitIds: z.array(z.string().min(1))
	})
	.superRefine(({ kind, brand, measurable, unitIds }, ctx) => {
		// The brand is only asked for, and checked, when the recipe needs a specific product.
		if (kind === IngredientKinds.branded) {
			const result = ingredientBrandValidation.safeParse(brand);
			if (!result.success) {
				ctx.addIssue({
					code: 'custom',
					message: 'errors.ingredients.brand',
					path: ['brand']
				});
			}
		}
		// An ingredient that can be measured needs at least one unit.
		if (measurable && unitIds.length === 0) {
			ctx.addIssue({ code: 'custom', message: 'errors.ingredients.unit', path: ['unitIds'] });
		}
	});
//validators
export const ingredientFormValidator = validateSchema<IngredientForm>(ingredientFormSchema);

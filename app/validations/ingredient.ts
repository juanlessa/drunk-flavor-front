import { z } from 'zod/v4';
import {
	INGREDIENT_BRAND_MAX_LENGTH,
	INGREDIENT_DESCRIPTION_MAX_LENGTH,
	IngredientKinds
} from '~/domain/ingredient/ingredient.constants';
import { Genders } from '~/domain/shared/gender.constants';
import { languages } from '~/domain/shared/translations.constants';
import { getZodGenderedTranslationsSchema } from '~/helpers/getZodTranslationsSchema';
import { validateSchema } from '~/helpers/validateSchema';
import type { IngredientForm } from '~/types/ingredient.types';
// fields validation
export const ingredientNameValidation = z
	.string()
	.trim()
	.min(1, { error: 'errors.ingredients.name' });
export const ingredientNamePluralValidation = z
	.string()
	.trim()
	.min(1, { error: 'errors.ingredients.namePlural' });
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
	namePlural: z.string().optional(),
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
		unitIds: z.array(z.string().min(1)),
		requiresNamePlural: z.boolean()
	})
	.superRefine(({ kind, brand, measurable, unitIds, requiresNamePlural, translations }, ctx) => {
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
		// A unit written with the ingredient name ("3 limes") needs the plural name in every language.
		if (measurable && requiresNamePlural) {
			const formTranslations = translations as IngredientForm['translations'];
			languages.forEach((lang) => {
				if (
					!ingredientNamePluralValidation.safeParse(
						formTranslations[lang].namePlural ?? ''
					).success
				) {
					ctx.addIssue({
						code: 'custom',
						message: 'errors.ingredients.namePlural',
						path: ['translations', lang, 'namePlural']
					});
				}
			});
		}
	});
//validators
export const ingredientFormValidator = validateSchema<IngredientForm>(ingredientFormSchema);

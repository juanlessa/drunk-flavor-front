import { z } from 'zod/v4';
import { getZodTranslationsSchema } from '~/helpers/getZodTranslationsSchema';
import { validateSchema } from '~/helpers/validateSchema';
import type { DrinkForm } from '~/types/drink';

// fields validation
export const drinkNameValidation = z.string().trim().min(1, { error: 'errors.drinks.name' });

export const drinkMethodValidation = z.string().trim().min(1, { error: 'errors.drinks.method' });

export const drinkIngredientsValidation = z
	.array(
		z.object({
			ingredient_id: z.string().min(1),
			quantity: z.number().gt(0)
		})
	)
	.min(1, { error: 'errors.drinks.ingredients' });

// schemas
export const drinkTranslationSchema = z.object({
	name: drinkNameValidation,
	method: drinkMethodValidation
});

export const drinkFormSchema = z.object({
	translations: getZodTranslationsSchema(drinkTranslationSchema),
	ingredients: drinkIngredientsValidation
});

//validators
export const drinkFormValidator = validateSchema<DrinkForm>(drinkFormSchema);

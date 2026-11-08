import { z } from 'zod/v4';
import { DrinkIngredientAmountTypes } from '~/domain/drink/drink.constants';
import { getZodTranslationsSchema } from '~/helpers/getZodTranslationsSchema';
import { validateSchema } from '~/helpers/validateSchema';
import type { DrinkForm } from '~/types/drink.types';

// fields validation
export const drinkNameValidation = z.string().trim().min(1, { error: 'errors.drinks.name' });

export const drinkMethodValidation = z.string().trim().min(1, { error: 'errors.drinks.method' });

// Only an exact amount is edited by the form, so only it is checked; the other amounts are carried as they came.
export const drinkIngredientAmountValidation = z.discriminatedUnion('type', [
	z.object({
		type: z.literal(DrinkIngredientAmountTypes.exact),
		quantity: z
			.number({ error: 'errors.drinks.quantity' })
			.gt(0, { error: 'errors.drinks.quantity' }),
		unitId: z.string().min(1, { error: 'errors.drinks.quantity' })
	}),
	z.object({ type: z.literal(DrinkIngredientAmountTypes.qualitative) }).loose(),
	z.object({ type: z.literal(DrinkIngredientAmountTypes.none) })
]);
export const drinkIngredientsValidation = z
	.array(
		z.object({
			ingredientId: z.string().min(1),
			amount: drinkIngredientAmountValidation,
			optional: z.boolean()
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

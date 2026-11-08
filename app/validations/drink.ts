import { z } from 'zod/v4';
import {
	DrinkIngredientAmountTypes,
	DrinkIngredientQualifiers,
	DrinkMethodModes
} from '~/domain/drink/drink.constants';
import { languages } from '~/domain/shared/translations.constants';
import { getZodTranslationsSchema } from '~/helpers/getZodTranslationsSchema';
import { hasQuantity } from '~/helpers/recipe.helpers';
import { validateSchema } from '~/helpers/validateSchema';
import type { DrinkForm } from '~/types/drink.types';
import { preparationPlanValidation } from './preparation';

// fields validation
export const drinkNameValidation = z.string().trim().min(1, { error: 'errors.drinks.name' });
export const drinkMethodValidation = z.string().trim().min(1, { error: 'errors.drinks.method' });

const quantityValidation = z
	.number({ error: 'errors.drinks.quantity' })
	.gt(0, { error: 'errors.drinks.quantity' });
const unitIdValidation = z.string().min(1, { error: 'errors.drinks.unit' });

// An exact amount needs a quantity and a unit; a qualitative one needs its qualifier and, when it carries an
// approximate hint, the unit of the hint. An amount with nothing to measure has nothing to check.
export const drinkIngredientAmountValidation = z.discriminatedUnion('type', [
	z.object({
		type: z.literal(DrinkIngredientAmountTypes.exact),
		quantity: quantityValidation,
		unitId: unitIdValidation
	}),
	z
		.object({
			type: z.literal(DrinkIngredientAmountTypes.qualitative),
			qualifier: z.enum(DrinkIngredientQualifiers, { error: 'errors.drinks.qualifier' }),
			quantity: z.number().optional(),
			unitId: z.string().optional()
		})
		.superRefine((amount, ctx) => {
			if (hasQuantity(amount) && !amount.unitId) {
				ctx.addIssue({ code: 'custom', message: 'errors.drinks.unit', path: ['unitId'] });
			}
		}),
	z.object({ type: z.literal(DrinkIngredientAmountTypes.none) })
]);

const recipeLineValidation = z.object({
	ingredient: z.object({ id: z.string().min(1) }),
	amount: drinkIngredientAmountValidation,
	optional: z.boolean()
});

export const drinkIngredientsValidation = z
	.array(recipeLineValidation)
	.min(1, { error: 'errors.drinks.ingredients' })
	// A recipe needs at least one ingredient that is not optional.
	.refine((lines) => lines.length === 0 || lines.some(({ optional }) => !optional), {
		error: 'errors.drinks.requiredIngredient'
	});
export const drinkGarnishesValidation = z.array(recipeLineValidation);

// schemas
export const drinkTranslationSchema = z.object({
	name: drinkNameValidation,
	method: z.string()
});
export const drinkFormSchema = z
	.object({
		translations: getZodTranslationsSchema(drinkTranslationSchema),
		ingredients: drinkIngredientsValidation,
		garnishes: drinkGarnishesValidation,
		methodMode: z.enum(DrinkMethodModes),
		preparation: z.unknown()
	})
	.superRefine((form, ctx) => {
		// The methods are only asked for when they are written by hand; a plan writes them otherwise.
		if (form.methodMode === DrinkMethodModes.manual) {
			languages.forEach((lang) => {
				if (
					!drinkMethodValidation.safeParse(
						(form.translations[lang] as { method?: string }).method
					).success
				) {
					ctx.addIssue({
						code: 'custom',
						message: 'errors.drinks.method',
						path: ['translations', lang, 'method']
					});
				}
			});
			return;
		}
		const result = preparationPlanValidation.safeParse(form.preparation);
		if (!result.success) {
			result.error.issues.forEach((issue) =>
				ctx.addIssue({
					code: 'custom',
					message: issue.message,
					path: ['preparation', ...issue.path]
				})
			);
		}
	});

//validators
export const drinkFormValidator = validateSchema<DrinkForm>(drinkFormSchema);

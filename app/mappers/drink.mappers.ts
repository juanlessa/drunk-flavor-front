import { DrinkMethodModes } from '~/domain/drink/drink.constants';
import type {
	CreateDrink,
	DrinkGarnishRequest,
	DrinkIngredientRequest,
	DrinkMethodRequest,
	GenerateMethod,
	UpdateDrink
} from '~/domain/drink/drink.dtos';
import type { Drink, DrinkRecipeItem, DrinkTranslation } from '~/domain/drink/drink.entity';
import type { PreparationPlan } from '~/domain/preparation/preparation.entity';
import { languages } from '~/domain/shared/translations.constants';
import type { Translations } from '~/domain/shared/translations.types';
import { initEmptyPreparationPlan } from '~/factories/drink.factory';
import { mapAmountToRequest } from '~/helpers/drink.helpers';
import { cleanAmount } from '~/helpers/recipe.helpers';
import type { DrinkForm, DrinkRecipeLineForm } from '~/types/drink.types';

const copyTranslations = (source: Translations<DrinkTranslation>) =>
	languages.reduce((acc, lang) => {
		acc[lang] = { ...source[lang] };
		return acc;
	}, {} as Translations<DrinkTranslation>);

const toLineForm = (item: DrinkRecipeItem, optional: boolean): DrinkRecipeLineForm => ({
	ingredient: item.ingredient,
	amount: mapAmountToRequest(item.amount),
	optional
});

/**
 * A copy that does not share anything with the original. The plan is plain JSON, and a copy by `structuredClone`
 * would fail for a drink held in a reactive object, which is how the edit page keeps it.
 */
const clonePlan = (plan: PreparationPlan): PreparationPlan => JSON.parse(JSON.stringify(plan));

export const mapDrinkToForm = (drink: Drink): DrinkForm => {
	// The method of a drink with a plan was written from it, so it is not edited: it is discarded here and
	// written again by the backend. Only a drink without a plan has a method that is worth keeping.
	const translations = copyTranslations(drink.translations);
	if (drink.preparation) {
		languages.forEach((lang) => {
			translations[lang].method = '';
		});
	}
	return {
		translations,
		ingredients: drink.ingredients.map((line) => toLineForm(line, line.optional)),
		garnishes: drink.garnishes.map((line) => toLineForm(line, false)),
		methodMode: drink.preparation ? DrinkMethodModes.generated : DrinkMethodModes.manual,
		preparation: drink.preparation ? clonePlan(drink.preparation) : initEmptyPreparationPlan()
	};
};

export const mapLinesToIngredientRequests = (
	lines: DrinkRecipeLineForm[]
): DrinkIngredientRequest[] =>
	lines.map(({ ingredient, amount, optional }) => ({
		ingredientId: ingredient.id,
		amount: cleanAmount(amount),
		optional
	}));

/** A garnish is always optional by nature, so the flag is not sent. */
export const mapLinesToGarnishRequests = (lines: DrinkRecipeLineForm[]): DrinkGarnishRequest[] =>
	lines.map(({ ingredient, amount }) => ({
		ingredientId: ingredient.id,
		amount: cleanAmount(amount)
	}));

/**
 * The method is sent in exactly one way: the plan and only the names when it is generated (the backend writes
 * the methods from it), the methods written by hand otherwise.
 */
const mapMethodRequest = ({
	translations,
	methodMode,
	preparation
}: DrinkForm): DrinkMethodRequest => {
	if (methodMode === DrinkMethodModes.generated) {
		return {
			translations: languages.reduce(
				(acc, lang) => {
					acc[lang] = { name: translations[lang].name };
					return acc;
				},
				{} as Translations<Pick<DrinkTranslation, 'name'>>
			),
			preparation
		};
	}
	return { translations: copyTranslations(translations) };
};

export const mapFormToCreateDrink = (drinkForm: DrinkForm): CreateDrink => ({
	...mapMethodRequest(drinkForm),
	ingredients: mapLinesToIngredientRequests(drinkForm.ingredients),
	garnishes: mapLinesToGarnishRequests(drinkForm.garnishes)
});

export const mapFormToUpdateDrink = (id: string, drinkForm: DrinkForm): UpdateDrink => ({
	id,
	...mapMethodRequest(drinkForm),
	ingredients: mapLinesToIngredientRequests(drinkForm.ingredients),
	garnishes: mapLinesToGarnishRequests(drinkForm.garnishes)
});

/** What the preview sends: the recipe lines of the form and its plan. */
export const mapFormToGenerateMethod = (drinkForm: DrinkForm): GenerateMethod => ({
	ingredients: mapLinesToIngredientRequests(drinkForm.ingredients),
	garnishes: mapLinesToGarnishRequests(drinkForm.garnishes),
	preparation: drinkForm.preparation
});

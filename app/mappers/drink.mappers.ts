import type {
	CreateDrink,
	DrinkGarnishRequest,
	DrinkIngredientRequest,
	DrinkMethodRequest,
	UpdateDrink
} from '~/domain/drink/drink.dtos';
import type { Drink, DrinkTranslation } from '~/domain/drink/drink.entity';
import { languages } from '~/domain/shared/translations.constants';
import type { Translations } from '~/domain/shared/translations.types';
import { mapAmountToRequest } from '~/helpers/drink.helpers';
import type { DrinkForm } from '~/types/drink.types';

const copyTranslations = (source: Translations<DrinkTranslation>) =>
	languages.reduce((acc, lang) => {
		acc[lang] = { ...source[lang] };
		return acc;
	}, {} as Translations<DrinkTranslation>);

export const mapDrinkToForm = (drink: Drink): DrinkForm => {
	const ingredients = drink.ingredients.map<DrinkIngredientRequest>((line) => ({
		ingredientId: line.ingredient.id,
		amount: mapAmountToRequest(line.amount),
		optional: line.optional
	}));
	const garnishes = drink.garnishes.map<DrinkGarnishRequest>((line) => ({
		ingredientId: line.ingredient.id,
		amount: mapAmountToRequest(line.amount)
	}));
	return {
		translations: copyTranslations(drink.translations),
		ingredients,
		garnishes,
		...(drink.preparation && { preparation: structuredClone(drink.preparation) })
	};
};

/**
 * The method is sent in exactly one way: a drink that has a plan sends the plan and the names (the backend
 * writes the methods from it), any other drink sends the methods written by hand.
 */
const mapMethodRequest = ({ translations, preparation }: DrinkForm): DrinkMethodRequest => {
	if (preparation) {
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
	ingredients: drinkForm.ingredients,
	garnishes: drinkForm.garnishes
});

export const mapFormToUpdateDrink = (id: string, drinkForm: DrinkForm): UpdateDrink => ({
	id,
	...mapMethodRequest(drinkForm),
	ingredients: drinkForm.ingredients,
	garnishes: drinkForm.garnishes
});

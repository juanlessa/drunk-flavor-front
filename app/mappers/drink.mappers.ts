import type { DrinkIngredientRequest, CreateDrink, UpdateDrink } from '~/domain/drink/drink.dtos';
import type { Drink, DrinkTranslation } from '~/domain/drink/drink.entity';
import { languages } from '~/domain/shared/translations.constants';
import type { Translations } from '~/domain/shared/translations.types';
import type { DrinkForm } from '~/types/drink.types';

export const mapDrinkToForm = (drink: Drink): DrinkForm => {
	const translations = languages.reduce((acc, lang) => {
		acc[lang] = { ...drink.translations[lang] };
		return acc;
	}, {} as Translations<DrinkTranslation>);

	const ingredients = drink.ingredients.map<DrinkIngredientRequest>((d) => ({
		ingredientId: d.ingredient.id,
		quantity: d.quantity
	}));

	return {
		translations,
		ingredients
	};
};

export const mapFormToCreateDrink = (drinkForm: DrinkForm): CreateDrink => {
	const translations = languages.reduce((acc, lang) => {
		acc[lang] = { ...drinkForm.translations[lang] };
		return acc;
	}, {} as Translations<DrinkTranslation>);
	const { ingredients } = drinkForm;
	return {
		translations,
		ingredients
	};
};

export const mapFormToUpdateDrink = (id: string, drinkForm: DrinkForm): UpdateDrink => {
	const translations = languages.reduce((acc, lang) => {
		acc[lang] = { ...drinkForm.translations[lang] };
		return acc;
	}, {} as Translations<DrinkTranslation>);
	const { ingredients } = drinkForm;

	return {
		id,
		translations,
		ingredients
	};
};

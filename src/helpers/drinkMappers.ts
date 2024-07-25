import { languages } from '~/constants/translations';
import type {
	CreateDrink,
	Drink,
	DrinkForm,
	DrinkIngredientRequest,
	DrinkTranslation,
	UpdateDrink
} from '~/types/drink';
import type { Translations } from '~/types/translations';

export const mapDrinkToForm = (drink: Drink): DrinkForm => {
	const translations = languages.reduce((acc, lang) => {
		acc[lang] = { ...drink.translations[lang] };
		return acc;
	}, {} as Translations<DrinkTranslation>);

	const ingredients = drink.ingredients.map<DrinkIngredientRequest>((d) => ({
		ingredient_id: d.ingredient._id,
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

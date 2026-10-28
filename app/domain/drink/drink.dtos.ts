import type { Translations } from '../shared/translations.types';
import type { DrinkTranslation } from './drink.entity';

export type DrinkIngredientRequest = {
	quantity: number;
	ingredientId: string;
};

export type CreateDrink = {
	translations: Translations<DrinkTranslation>;
	ingredients: DrinkIngredientRequest[];
};

export type UpdateDrink = {
	id: string;
	translations: Translations<DrinkTranslation>;
	ingredients: DrinkIngredientRequest[];
};

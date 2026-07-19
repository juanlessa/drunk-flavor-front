import type { Ingredient } from '../ingredient/ingredient.entity';
import type { DatabaseCommonInfo } from '../shared/database.types';
import type { Translations } from '../shared/translations.types';

export type DrinkTranslation = {
	name: string;
	method: string;
};

export type DrinkIngredient = {
	quantity: number;
	ingredient: Ingredient;
};

export type Drink = DatabaseCommonInfo & {
	translations: Translations<DrinkTranslation>;
	cover: string;
	thumbnail: string;
	ingredients: DrinkIngredient[];
};

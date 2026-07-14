import type { DatabaseCommonInfo } from './database';
import type { Filter } from './filters';
import type { FieldError } from './form';
import type { Ingredient } from './ingredient';
import type { Translations } from './translations';

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

export type DrinkIngredientRequest = {
	quantity: number;
	ingredient_id: string;
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

export type DrinksOverviewState = {
	drinks: Drink[];
	filter: Filter;
	loading: boolean;
};

export type DrinkForm = {
	translations: Translations<DrinkTranslation>;
	ingredients: DrinkIngredientRequest[];
};

export type DrinkFormState = {
	form: DrinkForm;
	cover: File | undefined;
	thumbnail: File | undefined;
	errors: FieldError[];
	displayErrors: boolean;
	defaultIngredients: DrinkIngredientRequest[];
};

export type DrinkFormAndMedia = {
	form: DrinkForm;
	cover: File | undefined;
	thumbnail: File | undefined;
};

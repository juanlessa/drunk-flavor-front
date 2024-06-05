import type { DatabaseCommonInfo } from './database';
import type { FieldError } from './form';
import type { IIngredient } from './ingredient';
import type { ITranslations } from './translations';

export type IDrinkTranslation = {
	name: string;
	method: string;
};

export type IDrinkIngredient = {
	quantity: number;
	ingredient: IIngredient;
};

export type IDrink = DatabaseCommonInfo & {
	translations: ITranslations<IDrinkTranslation>;
	cover: string;
	thumbnail: string;
	ingredients: IDrinkIngredient[];
};

export type DrinkState = {
	drinks: IDrink[];
};

export type IDrinkIngredientRequest = {
	quantity: number;
	ingredient_id: string;
};

export type ICreateDrink = {
	translations: ITranslations<IDrinkTranslation>;
	ingredients: IDrinkIngredientRequest[];
};

export type ICreateDrinkResponse = {
	id: string;
};

export type IUpdateDrink = {
	id: string;
	translations: ITranslations<IDrinkTranslation>;
	ingredients: IDrinkIngredientRequest[];
};

export type IDrinkForm = {
	translations: ITranslations<IDrinkTranslation>;
	ingredients: IDrinkIngredientRequest[];
};

export type DrinkFormState = {
	form: IDrinkForm;
	cover: File | undefined;
	thumbnail: File | undefined;
	errors: FieldError[];
	displayErrors: boolean;
	defaultIngredients: IDrinkIngredientRequest[];
};

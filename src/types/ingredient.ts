import type { ICategory } from './category';
import type { DatabaseCommonInfo } from './database';
import type { FieldError } from './form';
import type { ITranslations } from './translations';

export type IIngredientTranslation = {
	name: string;
	unit: string;
	unit_plural: string;
};

export type IIngredient = DatabaseCommonInfo & {
	translations: ITranslations<IIngredientTranslation>;
	category: ICategory;
	is_alcoholic: boolean;
};

export type ICreateIngredient = {
	translations: ITranslations<IIngredientTranslation>;
	category_id: string;
	is_alcoholic: boolean;
};

export type IUpdateIngredient = {
	id: string;
	translations: ITranslations<IIngredientTranslation>;
	category_id: string;
	is_alcoholic: boolean;
};

export type IngredientsOverviewState = {
	ingredients: IIngredient[];
	loading: boolean;
};

export type IngredientForm = {
	translations: ITranslations<IIngredientTranslation>;
	category_id: string;
	is_alcoholic: boolean;
};

export type IngredientFormState = {
	form: IngredientForm;
	errors: FieldError[];
	displayErrors: boolean;
	defaultCategory: string;
};

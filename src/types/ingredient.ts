import type { Category } from './category';
import type { DatabaseCommonInfo } from './database';
import type { Filter } from './filters';
import type { FieldError } from './form';
import type { Translations } from './translations';

export type IngredientTranslation = {
	name: string;
	unit: string;
	unit_plural: string;
};

export type Ingredient = DatabaseCommonInfo & {
	translations: Translations<IngredientTranslation>;
	category: Category;
	is_alcoholic: boolean;
};

export type CreateIngredient = {
	translations: Translations<IngredientTranslation>;
	category_id: string;
	is_alcoholic: boolean;
};

export type UpdateIngredient = {
	id: string;
	translations: Translations<IngredientTranslation>;
	category_id: string;
	is_alcoholic: boolean;
};

export type IngredientsOverviewState = {
	ingredients: Ingredient[];
	filter: Filter;
	loading: boolean;
};

export type IngredientForm = {
	translations: Translations<IngredientTranslation>;
	category_id: string;
	is_alcoholic: boolean;
};

export type IngredientFormState = {
	form: IngredientForm;
	errors: FieldError[];
	displayErrors: boolean;
};

import type { DrinkIngredientRequest } from '~/domain/drink/drink.dtos';
import type { Drink, DrinkTranslation } from '~/domain/drink/drink.entity';
import type { Filter } from '~/domain/shared/filters.types';
import type { Translations } from '~/domain/shared/translations.types';
import type { FieldError } from './form.types';

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

import type { PaginatedOverviewState } from '~/types/overview.types';
import type { DrinkMethodModes } from '~/domain/drink/drink.constants';
import type { DrinkIngredientAmountRequest } from '~/domain/drink/drink.dtos';
import type { Drink, DrinkTranslation } from '~/domain/drink/drink.entity';
import type { Ingredient } from '~/domain/ingredient/ingredient.entity';
import type { PreparationPlan } from '~/domain/preparation/preparation.entity';
import type { ApiFieldError } from '~/domain/shared/api.types';
import type { Filter } from '~/domain/shared/filters.types';
import type { Translations } from '~/domain/shared/translations.types';
import type { FieldError } from './form.types';

export type DrinksOverviewState = {
	drinks: Drink[];
	filter: Filter;
	loading: boolean;
};

export type DrinksControlOverviewState = PaginatedOverviewState<'drinks', Drink>;

export type DrinkMethodMode = (typeof DrinkMethodModes)[keyof typeof DrinkMethodModes];

/**
 * One line of the ingredients or of the garnishes as the form edits it. It carries the whole ingredient, not only
 * its id, because the form shows its names and units and the preparation plan points at it.
 */
export type DrinkRecipeLineForm = {
	ingredient: Ingredient;
	amount: DrinkIngredientAmountRequest;
	// Only the ingredients can be optional; a garnish always is, so the mapper does not send it.
	optional: boolean;
};

export type DrinkForm = {
	// The method of each language is only used when it is written by hand (`methodMode` is `manual`).
	translations: Translations<DrinkTranslation>;
	ingredients: DrinkRecipeLineForm[];
	garnishes: DrinkRecipeLineForm[];
	methodMode: DrinkMethodMode;
	// Always present so the builder has something to edit; it is only sent when `methodMode` is `generated`.
	preparation: PreparationPlan;
};

export type DrinkFormState = {
	form: DrinkForm;
	cover: File | undefined;
	thumbnail: File | undefined;
	errors: FieldError[];
	displayErrors: boolean;
};

export type DrinkFormAndMedia = {
	form: DrinkForm;
	cover: File | undefined;
	thumbnail: File | undefined;
};

/** What the API said about the last attempt to generate the method, so the form can point at where it happened. */
export type PreparationPreviewState = {
	loading: boolean;
	method: Translations<string> | undefined;
	sentences: Translations<string[]> | undefined;
	errors: ApiFieldError[];
	warnings: ApiFieldError[];
	// True once the recipe or the plan changed after the preview was generated.
	stale: boolean;
};

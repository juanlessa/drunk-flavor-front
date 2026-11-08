import type { PaginatedOverviewState } from '~/types/overview.types';
import type { DrinkGarnishRequest, DrinkIngredientRequest } from '~/domain/drink/drink.dtos';
import type { Drink, DrinkTranslation } from '~/domain/drink/drink.entity';
import type { PreparationPlan } from '~/domain/preparation/preparation.entity';
import type { Filter } from '~/domain/shared/filters.types';
import type { Translations } from '~/domain/shared/translations.types';
import type { FieldError } from './form.types';

export type DrinksOverviewState = {
	drinks: Drink[];
	filter: Filter;
	loading: boolean;
};

export type DrinksControlOverviewState = PaginatedOverviewState<'drinks', Drink>;

export type DrinkForm = {
	translations: Translations<DrinkTranslation>;
	ingredients: DrinkIngredientRequest[];
	// Not edited by the form yet: they are carried from the loaded drink so an update does not remove them.
	garnishes: DrinkGarnishRequest[];
	preparation?: PreparationPlan;
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

import type { PaginatedOverviewState } from '~/types/overview.types';
import type { FieldError } from './form.types';
import type { QueryParams } from '../domain/shared/query.types';
import type { Translations } from '../domain/shared/translations.types';
import type { Ingredient, IngredientTranslation } from '~/domain/ingredient/ingredient.entity';

export type IngredientsOverviewState = PaginatedOverviewState<'ingredients', Ingredient>;

export type IngredientForm = {
	translations: Translations<IngredientTranslation>;
	categoryId: string;
	unitId: string;
};

export type IngredientFormState = {
	form: IngredientForm;
	errors: FieldError[];
	displayErrors: boolean;
};

export type IngredientSearchState = {
	options: Ingredient[];
	selected: Ingredient[];
	filter: {
		query: QueryParams;
		isLastPage: boolean;
		searchTerm: string;
	};
	loading: boolean;
};

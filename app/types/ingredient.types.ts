import type { PaginatedOverviewState } from '~/types/overview.types';
import type { FieldError } from './form.types';
import type { QueryParams } from '../domain/shared/query.types';
import type { Translations } from '../domain/shared/translations.types';
import type {
	Ingredient,
	IngredientKind,
	IngredientTranslation
} from '~/domain/ingredient/ingredient.entity';

export type IngredientsOverviewState = PaginatedOverviewState<'ingredients', Ingredient>;

export type IngredientForm = {
	// An empty description means "no description"; the mapper omits it (or removes the stored one).
	translations: Translations<IngredientTranslation>;
	categoryId: string;
	kind: IngredientKind;
	// Only used by a `branded` ingredient; an empty string means "not filled in yet".
	brand: string;
	// Off means the ingredient is listed without a number (e.g. foam), so it has no units.
	measurable: boolean;
	// Allowed units in display order; the first one is the default.
	unitIds: string[];
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

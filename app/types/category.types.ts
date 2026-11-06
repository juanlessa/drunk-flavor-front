import type { PaginatedOverviewState } from '~/types/overview.types';
import type { Translations } from '~/domain/shared/translations.types';
import type { FieldError } from '~/types/form.types';
import type { SearchSelectState } from '~/types/searchSelect.types';
import type { Category, CategoryTranslation } from '~/domain/category/category.entity';

export type CategoriesOverviewState = PaginatedOverviewState<'categories', Category>;

export type CategoryForm = {
	translations: Translations<CategoryTranslation>;
	isAlcoholic: boolean;
};

export type CategoryFormState = {
	form: CategoryForm;
	errors: FieldError[];
	displayErrors: boolean;
};

export type CategorySearchSelectState = SearchSelectState<Category>;

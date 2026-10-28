import type { InputSelectOption } from '~/components/atoms/inputSelect/InputSelect.types';
import type { Translations } from '~/domain/shared/translations.types';
import type { FieldError } from '~/types/form.types';
import type { Filter } from '~/domain/shared/filters.types';
import type { QueryParams } from '~/domain/shared/query.types';
import type { Category, CategoryTranslation } from '~/domain/category/category.entity';

export type CategoriesOverviewState = {
	categories: Category[];
	filter: Filter;
	loading: boolean;
};

export type CategoryForm = {
	translations: Translations<CategoryTranslation>;
	isAlcoholic: boolean;
};

export type CategoryFormState = {
	form: CategoryForm;
	errors: FieldError[];
	displayErrors: boolean;
};

export type CategorySearchSelectState = {
	options: Category[];
	selected: InputSelectOption;
	filter: {
		query: QueryParams;
		isLastPage: boolean;
		searchTerm: string;
	};
	loading: boolean;
};

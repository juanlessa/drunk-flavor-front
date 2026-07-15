import type { DatabaseCommonInfo } from './database';
import type { Translations } from './translations';
import type { FieldError } from './form';
import type { Filter } from './filters';
import type { QueryParams } from './query';
import type { InputSelectOption } from './InputSelect';

export type CategoryTranslation = {
	name: string;
};

export type Category = DatabaseCommonInfo & {
	translations: Translations<CategoryTranslation>;
};

export type CreateCategory = {
	translations: Translations<CategoryTranslation>;
};

export type UpdateCategory = {
	id: string;
	translations: Translations<CategoryTranslation>;
};

export type CategoriesOverviewState = {
	categories: Category[];
	filter: Filter;
	loading: boolean;
};

export type CategoryForm = {
	translations: Translations<CategoryTranslation>;
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

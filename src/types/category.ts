import type { DatabaseCommonInfo } from './database';
import type { ITranslations } from './translations';
import type { FieldError } from './form';
import type { Filter } from './filters';

export type ICategoryTranslation = {
	name: string;
};

export type ICategory = DatabaseCommonInfo & {
	translations: ITranslations<ICategoryTranslation>;
};

export type ICreateCategory = {
	translations: ITranslations<ICategoryTranslation>;
};

export type IUpdateCategory = {
	id: string;
	translations: ITranslations<ICategoryTranslation>;
};

export type CategoriesOverviewState = {
	categories: ICategory[];
	filter: Filter;
	loading: boolean;
};

export type CategoryForm = {
	translations: ITranslations<ICategoryTranslation>;
};

export type CategoryFormState = {
	form: CategoryForm;
	errors: FieldError[];
	displayErrors: boolean;
};

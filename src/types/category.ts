import type { DatabaseCommonInfo } from './database';
import type { ITranslations } from './translations';
import type { FieldError } from './form';

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

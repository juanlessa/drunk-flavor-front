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

export type CategoryState = {
	categories: ICategory[];
};

export type ICategoryForm = {
	translations: ITranslations<ICategoryTranslation>;
};

export type CategoryFormState = {
	form: ICategoryForm;
	errors: FieldError[];
	displayErrors: boolean;
};

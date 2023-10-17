import { DatabaseCommonInfo } from "@/types/database";
import { ITranslations } from "@/types/translations";

export type ICategoryTranslation = {
	name: string;
};

export type ICategory = DatabaseCommonInfo & {
	translations: ITranslations<ICategoryTranslation>;
};

export type ICreateCategory = {
	translations: ITranslations<ICategoryTranslation>;
};

export type CategoryState = {
	categories: ICategory[];
};

export type CategoryFormState = {
	form: ICreateCategory;
};

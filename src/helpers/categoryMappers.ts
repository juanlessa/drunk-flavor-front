import { languages } from '~/constants/translations';
import type {
	ICategory,
	ICategoryForm,
	ICategoryTranslation,
	ICreateCategory,
	IUpdateCategory
} from '~/types/category';
import type { ITranslations } from '~/types/translations';

export const mapCategoryToForm = (category: ICategory): ICategoryForm => {
	const translations = languages.reduce((acc, lang) => {
		acc[lang] = { ...category.translations[lang] };
		return acc;
	}, {} as ITranslations<ICategoryTranslation>);

	return {
		translations
	};
};

export const mapFormToCreateCategory = (categoryForm: ICategoryForm): ICreateCategory => {
	const translations = languages.reduce((acc, lang) => {
		acc[lang] = { ...categoryForm.translations[lang] };
		return acc;
	}, {} as ITranslations<ICategoryTranslation>);

	return {
		translations
	};
};

export const mapFormToUpdateCategory = (
	id: string,
	categoryForm: ICategoryForm
): IUpdateCategory => {
	const translations = languages.reduce((acc, lang) => {
		acc[lang] = { ...categoryForm.translations[lang] };
		return acc;
	}, {} as ITranslations<ICategoryTranslation>);

	return {
		id,
		translations
	};
};

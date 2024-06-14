import { languages } from '~/constants/translations';
import type {
	ICategory,
	CategoryForm,
	ICategoryTranslation,
	ICreateCategory,
	IUpdateCategory
} from '~/types/category';
import type { ITranslations } from '~/types/translations';

export const mapCategoryToForm = (category: ICategory): CategoryForm => {
	const translations = languages.reduce((acc, lang) => {
		acc[lang] = { ...category.translations[lang] };
		return acc;
	}, {} as ITranslations<ICategoryTranslation>);

	return {
		translations
	};
};

export const mapFormToCreateCategory = (categoryForm: CategoryForm): ICreateCategory => {
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
	categoryForm: CategoryForm
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

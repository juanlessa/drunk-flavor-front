import { languages } from '~/constants/translations';
import type {
	Category,
	CategoryForm,
	CategoryTranslation,
	CreateCategory,
	UpdateCategory
} from '~/types/category';
import type { Translations } from '~/types/translations';

export const mapCategoryToForm = (category: Category): CategoryForm => {
	const translations = languages.reduce((acc, lang) => {
		acc[lang] = { ...category.translations[lang] };
		return acc;
	}, {} as Translations<CategoryTranslation>);

	return {
		translations
	};
};

export const mapFormToCreateCategory = (categoryForm: CategoryForm): CreateCategory => {
	const translations = languages.reduce((acc, lang) => {
		acc[lang] = { ...categoryForm.translations[lang] };
		return acc;
	}, {} as Translations<CategoryTranslation>);

	return {
		translations
	};
};

export const mapFormToUpdateCategory = (id: string, categoryForm: CategoryForm): UpdateCategory => {
	const translations = languages.reduce((acc, lang) => {
		acc[lang] = { ...categoryForm.translations[lang] };
		return acc;
	}, {} as Translations<CategoryTranslation>);

	return {
		id,
		translations
	};
};

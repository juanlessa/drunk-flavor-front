import type { CategoryForm } from '~/types/category.types';
import { languages } from '~/domain/shared/translations.constants';
import type { Translations } from '~/domain/shared/translations.types';
import type { CreateCategory, UpdateCategory } from '~/domain/category/category.dtos';
import type { Category, CategoryTranslation } from '~/domain/category/category.entity';

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

import type { CategoryForm } from '~/types/category.types';
import { languages } from '~/domain/shared/translations.constants';
import type { Translations } from '~/domain/shared/translations.types';
import type { CreateCategory, UpdateCategory } from '~/domain/category/category.dtos';
import type { Category, CategoryTranslation } from '~/domain/category/category.entity';

const copyTranslations = (source: Translations<CategoryTranslation>) =>
	languages.reduce((acc, lang) => {
		acc[lang] = { ...source[lang] };
		return acc;
	}, {} as Translations<CategoryTranslation>);

export const mapCategoryToForm = (category: Category): CategoryForm => ({
	translations: copyTranslations(category.translations),
	is_alcoholic: category.is_alcoholic
});

export const mapFormToCreateCategory = (categoryForm: CategoryForm): CreateCategory => ({
	translations: copyTranslations(categoryForm.translations),
	is_alcoholic: categoryForm.is_alcoholic
});

export const mapFormToUpdateCategory = (
	id: string,
	categoryForm: CategoryForm
): UpdateCategory => ({
	id,
	...mapFormToCreateCategory(categoryForm)
});

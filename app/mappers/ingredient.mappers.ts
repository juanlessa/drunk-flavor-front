import type { CreateIngredient, UpdateIngredient } from '~/domain/ingredient/ingredient.dtos';
import type { Ingredient, IngredientTranslation } from '~/domain/ingredient/ingredient.entity';
import { languages } from '../domain/shared/translations.constants';
import type { IngredientForm } from '../types/ingredient.types';
import type { Translations } from '~/domain/shared/translations.types';

export const mapIngredientToForm = (ingredient: Ingredient): IngredientForm => {
	const translations = languages.reduce((acc, lang) => {
		acc[lang] = { ...ingredient.translations[lang] };
		return acc;
	}, {} as Translations<IngredientTranslation>);

	return {
		translations,
		is_alcoholic: ingredient.is_alcoholic,
		category_id: ingredient.category._id
	};
};

export const mapFormToCreateIngredient = (ingredientForm: IngredientForm): CreateIngredient => {
	const translations = languages.reduce((acc, lang) => {
		acc[lang] = { ...ingredientForm.translations[lang] };
		return acc;
	}, {} as Translations<IngredientTranslation>);

	return {
		translations,
		is_alcoholic: ingredientForm.is_alcoholic,
		category_id: ingredientForm.category_id
	};
};

export const mapFormToUpdateIngredient = (
	id: string,
	ingredientForm: IngredientForm
): UpdateIngredient => {
	const translations = languages.reduce((acc, lang) => {
		acc[lang] = { ...ingredientForm.translations[lang] };
		return acc;
	}, {} as Translations<IngredientTranslation>);

	return {
		id,
		translations,
		is_alcoholic: ingredientForm.is_alcoholic,
		category_id: ingredientForm.category_id
	};
};

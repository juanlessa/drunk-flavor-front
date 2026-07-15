import { languages } from '~/constants/translations';
import type {
	Ingredient,
	IngredientForm,
	IngredientTranslation,
	CreateIngredient,
	UpdateIngredient
} from '~/types/ingredient';
import type { Translations } from '~/types/translations';

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

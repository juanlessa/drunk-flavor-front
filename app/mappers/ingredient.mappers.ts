import type { CreateIngredient, UpdateIngredient } from '~/domain/ingredient/ingredient.dtos';
import type { Ingredient, IngredientTranslation } from '~/domain/ingredient/ingredient.entity';
import { languages } from '../domain/shared/translations.constants';
import type { IngredientForm } from '../types/ingredient.types';
import type { Translations } from '~/domain/shared/translations.types';

const copyTranslations = (source: Translations<IngredientTranslation>) =>
	languages.reduce((acc, lang) => {
		acc[lang] = { ...source[lang] };
		return acc;
	}, {} as Translations<IngredientTranslation>);

export const mapIngredientToForm = (ingredient: Ingredient): IngredientForm => ({
	translations: copyTranslations(ingredient.translations),
	category_id: ingredient.category._id,
	unit_id: ingredient.unit._id
});

export const mapFormToCreateIngredient = (ingredientForm: IngredientForm): CreateIngredient => ({
	translations: copyTranslations(ingredientForm.translations),
	category_id: ingredientForm.category_id,
	unit_id: ingredientForm.unit_id
});

export const mapFormToUpdateIngredient = (
	id: string,
	ingredientForm: IngredientForm
): UpdateIngredient => ({
	id,
	...mapFormToCreateIngredient(ingredientForm)
});

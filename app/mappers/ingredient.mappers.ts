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
	categoryId: ingredient.category.id,
	unitId: ingredient.unit.id
});

export const mapFormToCreateIngredient = (ingredientForm: IngredientForm): CreateIngredient => ({
	translations: copyTranslations(ingredientForm.translations),
	categoryId: ingredientForm.categoryId,
	unitId: ingredientForm.unitId
});

export const mapFormToUpdateIngredient = (
	id: string,
	ingredientForm: IngredientForm
): UpdateIngredient => ({
	id,
	...mapFormToCreateIngredient(ingredientForm)
});

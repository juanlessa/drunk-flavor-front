import type { Translations } from '../shared/translations.types';
import type { IngredientTranslation } from './ingredient.entity';

export type CreateIngredient = {
	translations: Translations<IngredientTranslation>;
	category_id: string;
	is_alcoholic: boolean;
};

export type UpdateIngredient = {
	id: string;
	translations: Translations<IngredientTranslation>;
	category_id: string;
	is_alcoholic: boolean;
};

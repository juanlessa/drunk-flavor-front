import type { Translations } from '../shared/translations.types';
import type { IngredientTranslation } from './ingredient.entity';

export type CreateIngredient = {
	translations: Translations<IngredientTranslation>;
	category_id: string;
	unit_id: string;
};

export type UpdateIngredient = CreateIngredient & {
	id: string;
};

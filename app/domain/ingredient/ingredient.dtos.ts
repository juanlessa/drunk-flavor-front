import type { Translations } from '../shared/translations.types';
import type { IngredientTranslation } from './ingredient.entity';

export type CreateIngredient = {
	translations: Translations<IngredientTranslation>;
	categoryId: string;
	unitId: string;
};

export type UpdateIngredient = CreateIngredient & {
	id: string;
};

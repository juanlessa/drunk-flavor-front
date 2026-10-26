import type { Category } from '../category/category.entity';
import type { DatabaseCommonInfo } from '../shared/database.types';
import type { Translations } from '../shared/translations.types';
import type { Unit } from '../unit/unit.entity';

export type IngredientTranslation = {
	name: string;
};

/**
 * Ingredient =
 *     _id: string
 *     translations: Translations<IngredientTranslation> ({ name } per language)
 *     category: Category (populated; alcoholic flag lives on the category)
 *     unit: Unit (populated; measurement unit used for quantities)
 *     created_at: Date
 *     updated_at: Date
 */
export type Ingredient = DatabaseCommonInfo & {
	translations: Translations<IngredientTranslation>;
	category: Category;
	unit: Unit;
};

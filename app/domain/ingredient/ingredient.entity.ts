import type { Category } from '../category/category.entity';
import type { DatabaseCommonInfo } from '../shared/database.types';
import type { Translations } from '../shared/translations.types';

export type IngredientTranslation = {
	name: string;
	unit: string;
	unit_plural: string;
};

export type Ingredient = DatabaseCommonInfo & {
	translations: Translations<IngredientTranslation>;
	category: Category;
	is_alcoholic: boolean;
};

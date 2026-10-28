import type { Category } from '../category/category.entity';
import type { EntityMetadata } from '../shared/entity.types';
import type { Translations } from '../shared/translations.types';
import type { Unit } from '../unit/unit.entity';

export type IngredientTranslation = { name: string };

export type Ingredient = EntityMetadata & {
	translations: Translations<IngredientTranslation>;
	category: Category;
	unit: Unit;
};

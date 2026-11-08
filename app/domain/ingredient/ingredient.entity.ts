import type { Category } from '../category/category.entity';
import type { EntityMetadata } from '../shared/entity.types';
import type { Gender } from '../shared/gender.types';
import type { Translations } from '../shared/translations.types';
import type { Unit } from '../unit/unit.entity';
import type { IngredientKinds } from './ingredient.constants';
export type IngredientKind = (typeof IngredientKinds)[keyof typeof IngredientKinds];
export type IngredientTranslation = {
	name: string;
	/** Short complement to the name, e.g. "Orange liqueur" for "Triple sec". */
	description?: string;
	/** Grammatical gender of the name in this language. The backend requires it in Portuguese. */
	gender?: Gender;
};
export type Ingredient = EntityMetadata & {
	translations: Translations<IngredientTranslation>;
	category: Category;
	/**
	 * Allowed units for this ingredient, in display order. An empty list means the ingredient
	 * is not measurable (e.g. ginger foam). A recipe picks one of these units per usage.
	 */
	units: Unit[];
	kind: IngredientKind;
	/** Brand name. Only present when `kind` is `branded`. */
	brand?: string;
};

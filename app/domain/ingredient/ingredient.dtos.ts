import type { Translations } from '../shared/translations.types';
import type { IngredientKind, IngredientTranslation } from './ingredient.entity';
export type CreateIngredient = {
	translations: Translations<IngredientTranslation>;
	categoryId: string;
	/** Allowed units in display order; empty means not measurable. */
	unitIds: string[];
	/** Defaults to `generic` when omitted. */
	kind?: IngredientKind;
	/** Required for `branded` ingredients and not allowed for the others. */
	brand?: string;
};
/** On update, a `null` description removes the current one and an omitted one keeps it. */
export type UpdateIngredientTranslation = Omit<IngredientTranslation, 'description'> & {
	description?: string | null;
};
export type UpdateIngredient = Omit<CreateIngredient, 'translations' | 'brand'> & {
	id: string;
	translations: Translations<UpdateIngredientTranslation>;
	/** Full replacement of the allowed units, in display order. */
	unitIds: string[];
	/** Omitted keeps the current kind and brand; a `generic` kind removes the brand. */
	kind?: IngredientKind;
	/** Omitted keeps the current brand; `null` removes it. */
	brand?: string | null;
};

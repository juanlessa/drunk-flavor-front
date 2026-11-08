/**
 * - `generic`: any brand works (e.g. blue curaçao, triple sec).
 * - `branded`: the recipe needs a specific brand product (e.g. Licor 43).
 */
export const IngredientKinds = {
	generic: 'generic',
	branded: 'branded'
} as const;
export const ingredientKinds = Object.values(IngredientKinds);
/** Limits the backend enforces on the free text of an ingredient. */
export const INGREDIENT_DESCRIPTION_MAX_LENGTH = 120;
export const INGREDIENT_BRAND_MAX_LENGTH = 60;

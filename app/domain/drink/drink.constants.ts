export const DrinkIngredientQualifiers = {
	topUp: 'top_up',
	toTaste: 'to_taste',
	asNeeded: 'as_needed'
} as const;
export const drinkIngredientQualifiers = Object.values(DrinkIngredientQualifiers);
export const DrinkIngredientAmountTypes = {
	exact: 'exact',
	qualitative: 'qualitative',
	none: 'none'
} as const;
export const drinkIngredientAmountTypes = Object.values(DrinkIngredientAmountTypes);

/** How the method of a drink is given: written by hand in each language, or generated from a preparation plan. */
// Generated comes first: building the method from steps is the default, writing it by hand the alternative.
export const DrinkMethodModes = {
	generated: 'generated',
	manual: 'manual'
} as const;
export const drinkMethodModes = Object.values(DrinkMethodModes);

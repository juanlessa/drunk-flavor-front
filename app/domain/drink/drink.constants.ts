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

/**
 * How many of the required ingredients of a drink may be missing from the ones a person has, when matching drinks
 * by ingredients: none, up to one, up to two, or any number (`any`) as long as the drink uses one of them.
 */
export const drinkMatchMaxMissing = [0, 1, 2, 'any'] as const;
/** The most ingredients the match accepts at once. */
export const DRINK_MATCH_MAX_INGREDIENTS = 50;

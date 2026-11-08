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

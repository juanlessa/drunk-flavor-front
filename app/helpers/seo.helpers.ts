/** Ingredients named in a meta description; more would push it past what search results show. */
export const MAX_DESCRIPTION_INGREDIENTS = 4;

/**
 * Joins ingredient names the way the language writes a list ("gin, Campari and vermouth",
 * "gin, Campari e vermute"), keeping only the first ones so the description stays short.
 */
export const formatIngredientList = (
	names: string[],
	locale: string,
	max = MAX_DESCRIPTION_INGREDIENTS
): string => {
	const listed = names
		.map((name) => name.trim())
		.filter(Boolean)
		.slice(0, max);
	return new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' }).format(listed);
};

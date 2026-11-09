import type { Drink, DrinkMatch, DrinkMatchMaxMissing } from '~/domain/drink/drink.entity';
import type { Language } from '~/domain/shared/translations.types';

export type DrinkMatchGroup = { missingCount: number; matches: DrinkMatch[] };

/**
 * Splits the matches into groups of the same number of missing ingredients, in the order they came. The API
 * sorts by that number before paging, so appending a page only grows the last group or adds new ones after it.
 */
export const groupMatchesByMissingCount = (matches: readonly DrinkMatch[]): DrinkMatchGroup[] =>
	matches.reduce<DrinkMatchGroup[]>((groups, match) => {
		const last = groups.at(-1);
		if (last && last.missingCount === match.missingCount) last.matches.push(match);
		else groups.push({ missingCount: match.missingCount, matches: [match] });
		return groups;
	}, []);

/** The names of the missing ingredients of a drink, in recipe order, each once. */
export const getMissingIngredientNames = (
	drink: Pick<Drink, 'ingredients'>,
	missingIngredientIds: readonly string[],
	locale: Language
): string[] => {
	const missing = new Set(missingIngredientIds);
	const names = new Map<string, string>();
	for (const { ingredient } of drink.ingredients) {
		if (missing.has(ingredient.id) && !names.has(ingredient.id)) {
			names.set(ingredient.id, ingredient.translations[locale].name);
		}
	}
	return [...names.values()];
};

const WIDER_MAX_MISSING: Record<string, DrinkMatchMaxMissing | undefined> = {
	'0': 1,
	'1': 2,
	'2': 'any',
	any: undefined
};

/** The next, more permissive way to match, offered when nothing is found; none after `any`. */
export const getWiderMaxMissing = (
	maxMissing: DrinkMatchMaxMissing
): DrinkMatchMaxMissing | undefined => WIDER_MAX_MISSING[String(maxMissing)];

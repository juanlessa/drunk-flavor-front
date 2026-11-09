import { DRINK_MATCH_MAX_INGREDIENTS, drinkMatchMaxMissing } from '~/domain/drink/drink.constants';
import type { DrinkMatchMaxMissing } from '~/domain/drink/drink.entity';
import type { Ingredient } from '~/domain/ingredient/ingredient.entity';
import { languages } from '~/domain/shared/translations.constants';
import type { BarIngredient, MyBarStorage } from '~/types/myBar.types';

export const EMPTY_BAR: MyBarStorage = { ingredients: [], maxMissing: 0 };

/** An id the API accepts: a MongoDB ObjectId, 24 hexadecimal characters. */
const OBJECT_ID_PATTERN = /^[0-9a-f]{24}$/i;

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value);

export const isDrinkMatchMaxMissing = (value: unknown): value is DrinkMatchMaxMissing =>
	(drinkMatchMaxMissing as readonly unknown[]).includes(value);

const toBarIngredientOrNull = (value: unknown): BarIngredient | null => {
	if (!isRecord(value) || typeof value.id !== 'string' || !OBJECT_ID_PATTERN.test(value.id))
		return null;
	const { translations } = value;
	if (!isRecord(translations)) return null;
	const names = languages.map((language) => {
		const translation = translations[language];
		return isRecord(translation) && typeof translation.name === 'string'
			? translation.name
			: null;
	});
	if (names.some((name) => name === null)) return null;
	return {
		id: value.id,
		translations: Object.fromEntries(
			languages.map((language, index) => [language, { name: names[index] as string }])
		) as BarIngredient['translations']
	};
};

/**
 * Reads what the bar kept in the browser. The storage can hold anything (an older format, a hand edit), so
 * every entry is checked: invalid ingredients and repeats are dropped, the list is capped at what the match
 * accepts, and an unknown mode falls back to none missing.
 */
export const parseStoredBar = (value: unknown): MyBarStorage => {
	if (!isRecord(value)) return { ...EMPTY_BAR, ingredients: [] };
	const seen = new Set<string>();
	const ingredients = (Array.isArray(value.ingredients) ? value.ingredients : [])
		.map(toBarIngredientOrNull)
		.filter((ingredient): ingredient is BarIngredient => {
			if (!ingredient || seen.has(ingredient.id)) return false;
			seen.add(ingredient.id);
			return true;
		})
		.slice(0, DRINK_MATCH_MAX_INGREDIENTS);
	const maxMissing = isDrinkMatchMaxMissing(value.maxMissing)
		? value.maxMissing
		: EMPTY_BAR.maxMissing;
	return { ingredients, maxMissing };
};

/** Parses the raw text of the storage, treating text that is not JSON as an empty bar. */
export const readStoredBar = (raw: string | null): MyBarStorage => {
	if (!raw) return { ...EMPTY_BAR, ingredients: [] };
	try {
		return parseStoredBar(JSON.parse(raw));
	} catch {
		return { ...EMPTY_BAR, ingredients: [] };
	}
};

/** Keeps only the names of an ingredient, which is all the bar shows. */
export const toBarIngredient = (
	ingredient: Pick<Ingredient, 'id' | 'translations'>
): BarIngredient => ({
	id: ingredient.id,
	translations: Object.fromEntries(
		languages.map((language) => [language, { name: ingredient.translations[language].name }])
	) as BarIngredient['translations']
});

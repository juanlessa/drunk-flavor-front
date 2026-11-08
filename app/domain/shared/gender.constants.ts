import { Languages } from './translations.constants';

/** Grammatical gender of a word in a given language (needed to pick articles, e.g. "o gin", "a vodka"). */
export const Genders = {
	masculine: 'masculine',
	feminine: 'feminine'
} as const;
export const genders = Object.values(Genders);

/**
 * The languages whose words need a grammatical gender (to pick the article in a written method, e.g. "o gin",
 * "a vodka"). The backend requires it in these languages and does not need it in the others.
 */
export const genderedLanguages = [Languages.pt] as const;

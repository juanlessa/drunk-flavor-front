import type { DrinkMatchMaxMissing } from '~/domain/drink/drink.entity';
import type { Translations } from '~/domain/shared/translations.types';

/** An ingredient a person has, with just what the bar needs to show it in every language. */
export type BarIngredient = {
	id: string;
	translations: Translations<{ name: string }>;
};

/** What the bar keeps in the browser between visits. */
export type MyBarStorage = {
	ingredients: BarIngredient[];
	maxMissing: DrinkMatchMaxMissing;
};

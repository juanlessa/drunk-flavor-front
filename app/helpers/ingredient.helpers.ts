import type { Ingredient } from '~/domain/ingredient/ingredient.entity';
import type { Language } from '~/domain/shared/translations.types';

/**
 * Secondary line of an ingredient card: "category · unit".
 * Units without a symbol (e.g. "leaf") fall back to their translated name.
 */
export const getIngredientSummary = (
	ingredient: Pick<Ingredient, 'category' | 'unit'>,
	locale: Language
): string => {
	const category = ingredient.category.translations[locale].name;
	const unit = ingredient.unit.symbol || ingredient.unit.translations[locale].name;
	return [category, unit].filter(Boolean).join(' · ');
};

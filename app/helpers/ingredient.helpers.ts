import type { Ingredient } from '~/domain/ingredient/ingredient.entity';
import type { Language } from '~/domain/shared/translations.types';
import type { Unit } from '~/domain/unit/unit.entity';
import { formatUnitQuantity } from './unit.helpers';

/**
 * The unit that cards and forms show for an ingredient: the first of its allowed units. It is undefined for an
 * ingredient that is not measurable (it has no units).
 */
export const getPrimaryUnit = (ingredient: Pick<Ingredient, 'units'>): Unit | undefined =>
	ingredient.units[0];
/**
 * Secondary line of an ingredient card: "category · unit".
 * Units without a symbol (e.g. "leaf") fall back to their translated name.
 */
export const getIngredientSummary = (
	ingredient: Pick<Ingredient, 'category' | 'units'>,
	locale: Language
): string => {
	const category = ingredient.category.translations[locale].name;
	const primaryUnit = getPrimaryUnit(ingredient);
	const unit = primaryUnit?.symbol || primaryUnit?.translations[locale].name;
	return [category, unit].filter(Boolean).join(' · ');
};

/**
 * Examples for the ingredient form preview, written as on the drink page
 * ("60 ml of Gin"): the singular (1), a plural (60 with a symbol, 2 without,
 * e.g. "2 leaves of Mint") and 1.5 when the unit allows decimals. Empty until
 * both the name and the unit are known.
 */
export const getIngredientPreviewItems = (
	name: string,
	unit: Pick<Unit, 'symbol' | 'spaceBeforeSymbol' | 'allowDecimal' | 'translations'> | undefined,
	locale: Language,
	ofPreposition: string
): string[] => {
	const ingredientName = name.trim();
	if (!ingredientName || !unit) return [];

	const write = (quantity: number) =>
		`${formatUnitQuantity(quantity, unit, locale)} ${ofPreposition} ${ingredientName}`;
	const quantities = [1, unit.symbol?.trim() ? 60 : 2, ...(unit.allowDecimal ? [1.5] : [])];
	return quantities.map(write);
};

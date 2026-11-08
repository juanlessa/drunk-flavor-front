import type { Language } from '~/domain/shared/translations.types';
import type { Unit } from '~/domain/unit/unit.entity';

const NUMBER_LOCALES: Record<Language, string> = { en: 'en-US', pt: 'pt-BR' };

/** How a quantity is written in the locale: "1.5" in English, "1,5" in Portuguese. */
export const formatQuantityValue = (quantity: number, locale: Language): string =>
	new Intl.NumberFormat(NUMBER_LOCALES[locale]).format(quantity);

/**
 * Picks the singular or the plural wording for a quantity by the plural rules of the language (CLDR), so
 * 1 is singular in both, but 1.5 is singular in Portuguese ("1,5 limão") and plural in English ("1.5 limes").
 */
export const pickByQuantity = (
	quantity: number,
	singular: string,
	plural: string,
	locale: Language
): string =>
	new Intl.PluralRules(NUMBER_LOCALES[locale]).select(quantity) === 'one' ? singular : plural;

/**
 * Secondary line of a unit card: "symbol · kind".
 * Units without a symbol (e.g. "leaf") show only the kind.
 */
export const getUnitSummary = (unit: Pick<Unit, 'symbol'>, kindLabel: string): string =>
	[unit.symbol, kindLabel].filter(Boolean).join(' · ');

/**
 * Examples for the unit form preview, in the given locale. With a symbol:
 * "60 ml", "1.5 ml" (when decimals are allowed) and both names; without one,
 * the names themselves are the written form. Empty when nothing is filled in.
 */
export const getUnitPreviewItems = (
	unit: Pick<Unit, 'symbol' | 'spaceBeforeSymbol' | 'allowDecimal' | 'translations'>,
	locale: Language
): string[] => {
	const { name, namePlural } = unit.translations[locale];
	const format = (quantity: number) => formatUnitQuantity(quantity, unit, locale);
	const hasName = !!name.trim();
	const hasPlural = !!namePlural.trim();

	const items = unit.symbol?.trim()
		? [
				format(60),
				unit.allowDecimal && format(1.5),
				hasName && `1 ${name.trim()}`,
				hasPlural && `2 ${namePlural.trim()}`
			]
		: [
				hasName && format(1),
				hasPlural && format(2),
				hasPlural && unit.allowDecimal && format(1.5)
			];

	return items.filter((item): item is string => !!item);
};

/**
 * How a quantity is written with a unit: "60 ml" / "60ml" when there is a symbol,
 * otherwise "1 leaf" / "2 leaves". Shared by the drink detail and the unit form preview.
 * A unit written with the ingredient name has no wording of its own here, so it falls back to its own names;
 * the callers that know the ingredient write it with `formatDrinkRecipeItem`.
 */
export const formatUnitQuantity = (
	quantity: number,
	unit: Pick<Unit, 'symbol' | 'spaceBeforeSymbol' | 'translations'>,
	locale: Language
): string => {
	const value = formatQuantityValue(quantity, locale);
	const symbol = unit.symbol?.trim();
	if (symbol) {
		return `${value}${unit.spaceBeforeSymbol ? ' ' : ''}${symbol}`;
	}
	const { name, namePlural } = unit.translations[locale];
	return `${value} ${pickByQuantity(quantity, name, namePlural, locale)}`;
};

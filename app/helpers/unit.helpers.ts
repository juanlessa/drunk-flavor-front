import type { Language } from '~/domain/shared/translations.types';
import type { Unit } from '~/domain/unit/unit.entity';

const NUMBER_LOCALES: Record<Language, string> = { en: 'en-US', pt: 'pt-BR' };

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
 */
export const formatUnitQuantity = (
	quantity: number,
	unit: Pick<Unit, 'symbol' | 'spaceBeforeSymbol' | 'translations'>,
	locale: Language
): string => {
	const value = new Intl.NumberFormat(NUMBER_LOCALES[locale]).format(quantity);
	const symbol = unit.symbol?.trim();
	if (symbol) {
		return `${value}${unit.spaceBeforeSymbol ? ' ' : ''}${symbol}`;
	}
	const { name, namePlural } = unit.translations[locale];
	return `${value} ${quantity === 1 ? name : namePlural}`;
};

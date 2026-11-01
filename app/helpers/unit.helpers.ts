import type { Unit } from '~/domain/unit/unit.entity';

/**
 * Secondary line of a unit card: "symbol · kind".
 * Units without a symbol (e.g. "leaf") show only the kind.
 */
export const getUnitSummary = (unit: Pick<Unit, 'symbol'>, kindLabel: string): string =>
	[unit.symbol, kindLabel].filter(Boolean).join(' · ');

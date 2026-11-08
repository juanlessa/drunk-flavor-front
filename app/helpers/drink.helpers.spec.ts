import { describe, expect, it } from 'vitest';
import type { DrinkIngredientAmount } from '~/domain/drink/drink.entity';
import type { Unit } from '~/domain/unit/unit.entity';
import { formatDrinkAmount, mapAmountToRequest } from './drink.helpers';

const milliliter = {
	id: 'unit-1',
	symbol: 'ml',
	spaceBeforeSymbol: false,
	allowDecimal: true,
	kind: 'volume',
	translations: {
		en: { name: 'milliliter', namePlural: 'milliliters' },
		pt: { name: 'mililitro', namePlural: 'mililitros' }
	}
} as Unit;

describe('formatDrinkAmount', () => {
	it('writes an exact amount with its unit', () => {
		expect(formatDrinkAmount({ type: 'exact', quantity: 60, unit: milliliter }, 'en')).toBe(
			'60ml'
		);
	});

	it('writes the approximate hint of a qualitative amount', () => {
		const amount: DrinkIngredientAmount = {
			type: 'qualitative',
			qualifier: 'top_up',
			quantity: 120,
			unit: milliliter
		};
		expect(formatDrinkAmount(amount, 'pt')).toBe('120ml');
	});

	it.each<DrinkIngredientAmount>([
		{ type: 'none' },
		{ type: 'qualitative', qualifier: 'to_taste' },
		{ type: 'qualitative', qualifier: 'top_up', quantity: 100 }
	])('writes nothing for an amount with nothing to measure', (amount) => {
		expect(formatDrinkAmount(amount, 'en')).toBe('');
	});
});

describe('mapAmountToRequest', () => {
	it('replaces the unit snapshot of an exact amount by its id', () => {
		expect(mapAmountToRequest({ type: 'exact', quantity: 60, unit: milliliter })).toEqual({
			type: 'exact',
			quantity: 60,
			unitId: 'unit-1'
		});
	});

	it('keeps the qualifier and only the hint that exists', () => {
		expect(mapAmountToRequest({ type: 'qualitative', qualifier: 'to_taste' })).toEqual({
			type: 'qualitative',
			qualifier: 'to_taste'
		});
		expect(
			mapAmountToRequest({
				type: 'qualitative',
				qualifier: 'top_up',
				quantity: 120,
				unit: milliliter
			})
		).toEqual({ type: 'qualitative', qualifier: 'top_up', quantity: 120, unitId: 'unit-1' });
	});

	it('maps an amount with nothing to measure to the type alone', () => {
		expect(mapAmountToRequest({ type: 'none' })).toEqual({ type: 'none' });
	});
});

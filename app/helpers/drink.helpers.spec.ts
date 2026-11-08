import { describe, expect, it } from 'vitest';
import type { DrinkIngredientAmount } from '~/domain/drink/drink.entity';
import type { Ingredient } from '~/domain/ingredient/ingredient.entity';
import type { Unit } from '~/domain/unit/unit.entity';
import { formatDrinkAmount, formatDrinkRecipeItem, mapAmountToRequest } from './drink.helpers';

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

describe('formatDrinkRecipeItem', () => {
	const each = {
		id: 'unit-each',
		allowDecimal: false,
		kind: 'count',
		useIngredientName: true,
		translations: {
			en: { name: 'unit', namePlural: 'units' },
			pt: { name: 'unidade', namePlural: 'unidades' }
		}
	} as Unit;
	const wedge = {
		id: 'unit-wedge',
		allowDecimal: false,
		kind: 'count',
		translations: {
			en: { name: 'wedge', namePlural: 'wedges' },
			pt: { name: 'gomo', namePlural: 'gomos' }
		}
	} as Unit;
	const lime = {
		id: 'ing-lime',
		translations: {
			en: { name: 'Lime', namePlural: 'Limes' },
			pt: { name: 'Limão', namePlural: 'Limões' }
		}
	} as Ingredient;
	const write = (amount: DrinkIngredientAmount, locale: 'en' | 'pt' = 'pt') =>
		formatDrinkRecipeItem({ ingredient: lime, amount }, locale);

	it('writes the quantity and the plural name with no "of" for a unit written with the ingredient name', () => {
		expect(write({ type: 'exact', quantity: 3, unit: each })).toEqual({
			measurement: '3',
			name: 'Limões',
			joinedByPreposition: false
		});
		expect(write({ type: 'exact', quantity: 3, unit: each }, 'en')).toEqual({
			measurement: '3',
			name: 'Limes',
			joinedByPreposition: false
		});
	});
	it('writes the name where the quantity reads in the singular', () => {
		expect(write({ type: 'exact', quantity: 1, unit: each }).name).toBe('Limão');
		expect(write({ type: 'exact', quantity: 1.5, unit: each }, 'pt')).toMatchObject({
			measurement: '1,5',
			name: 'Limão'
		});
		expect(write({ type: 'exact', quantity: 1.5, unit: each }, 'en').name).toBe('Limes');
	});
	it('keeps the usual wording for another unit of the same ingredient', () => {
		expect(write({ type: 'exact', quantity: 3, unit: wedge })).toEqual({
			measurement: '3 gomos',
			name: 'Limão',
			joinedByPreposition: true
		});
	});
	it('writes the hint of a qualitative amount the same way', () => {
		expect(
			write({ type: 'qualitative', qualifier: 'top_up', quantity: 2, unit: each })
		).toMatchObject({ measurement: '2', name: 'Limões', joinedByPreposition: false });
	});
	it.each<DrinkIngredientAmount>([
		{ type: 'none' },
		{ type: 'qualitative', qualifier: 'to_taste' },
		{ type: 'qualitative', qualifier: 'top_up', quantity: 100 }
	])('writes only the name, with nothing to join, when there is nothing to measure', (amount) => {
		expect(write(amount)).toEqual({
			measurement: '',
			name: 'Limão',
			joinedByPreposition: false
		});
	});
	it('joins a usual measurement to the name with "of"', () => {
		expect(write({ type: 'exact', quantity: 60, unit: milliliter }, 'en')).toEqual({
			measurement: '60ml',
			name: 'Lime',
			joinedByPreposition: true
		});
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

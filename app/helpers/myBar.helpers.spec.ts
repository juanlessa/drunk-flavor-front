import { describe, expect, it } from 'vitest';
import { DRINK_MATCH_MAX_INGREDIENTS } from '~/domain/drink/drink.constants';
import {
	isDrinkMatchMaxMissing,
	parseStoredBar,
	readStoredBar,
	toBarIngredient
} from './myBar.helpers';

const id = (index: number) => index.toString(16).padStart(24, '0');
const stored = (index: number, en = `Ingredient ${index}`, pt = `Ingrediente ${index}`) => ({
	id: id(index),
	translations: { en: { name: en }, pt: { name: pt } }
});

describe('parseStoredBar', () => {
	it('keeps a valid bar as it is', () => {
		const bar = {
			ingredients: [stored(1, 'Gin', 'Gin'), stored(2, 'Lime', 'Limão')],
			maxMissing: 1
		};

		expect(parseStoredBar(bar)).toEqual(bar);
	});

	it.each([0, 1, 2, 'any'])('keeps the way to match %s', (maxMissing) => {
		expect(parseStoredBar({ ingredients: [], maxMissing }).maxMissing).toBe(maxMissing);
	});

	it.each([3, -1, '1', 'all', null, undefined])(
		'falls back to none missing for %s',
		(maxMissing) => {
			expect(parseStoredBar({ ingredients: [], maxMissing }).maxMissing).toBe(0);
		}
	);

	it.each([
		{ title: 'an id that is not an ObjectId', ingredient: { ...stored(1), id: 'gin' } },
		{ title: 'no id', ingredient: { translations: stored(1).translations } },
		{
			title: 'a language missing',
			ingredient: { id: id(1), translations: { en: { name: 'Gin' } } }
		},
		{
			title: 'a name that is not text',
			ingredient: { id: id(1), translations: { en: { name: 1 }, pt: { name: 'Gin' } } }
		},
		{ title: 'not an object', ingredient: 'gin' }
	])('drops an ingredient with $title', ({ ingredient }) => {
		expect(
			parseStoredBar({ ingredients: [ingredient, stored(2)], maxMissing: 0 }).ingredients
		).toEqual([stored(2)]);
	});

	it('keeps only the names of each ingredient', () => {
		const ingredient = {
			...stored(1),
			units: [],
			translations: { en: { name: 'Gin', extra: 1 }, pt: { name: 'Gin' } }
		};

		expect(parseStoredBar({ ingredients: [ingredient] }).ingredients).toEqual([
			stored(1, 'Gin', 'Gin')
		]);
	});

	it('keeps the first of an ingredient listed twice', () => {
		const bar = {
			ingredients: [stored(1, 'Gin'), stored(2), stored(1, 'Gin again')],
			maxMissing: 0
		};

		expect(
			parseStoredBar(bar).ingredients.map(({ translations }) => translations.en.name)
		).toEqual(['Gin', 'Ingredient 2']);
	});

	it('keeps no more ingredients than the match accepts', () => {
		const ingredients = Array.from({ length: DRINK_MATCH_MAX_INGREDIENTS + 5 }, (_, index) =>
			stored(index + 1)
		);

		expect(parseStoredBar({ ingredients }).ingredients).toHaveLength(
			DRINK_MATCH_MAX_INGREDIENTS
		);
	});

	it.each([null, 'bar', 42, [], { ingredients: 'gin' }])('reads %o as an empty bar', (value) => {
		expect(parseStoredBar(value)).toEqual({ ingredients: [], maxMissing: 0 });
	});
});

describe('readStoredBar', () => {
	it('parses the text kept in the browser', () => {
		expect(
			readStoredBar(JSON.stringify({ ingredients: [stored(1)], maxMissing: 'any' }))
		).toEqual({
			ingredients: [stored(1)],
			maxMissing: 'any'
		});
	});

	it.each([null, '', '{not json'])('reads %o as an empty bar', (raw) => {
		expect(readStoredBar(raw)).toEqual({ ingredients: [], maxMissing: 0 });
	});

	it('gives a new empty bar every time, so one cannot change the next', () => {
		const first = readStoredBar(null);
		first.ingredients.push(stored(1));

		expect(readStoredBar(null).ingredients).toEqual([]);
	});
});

describe('toBarIngredient', () => {
	it('keeps the id and the name of each language, leaving the rest out', () => {
		const ingredient = {
			id: id(1),
			translations: {
				en: { name: 'Lime', description: 'Fresh', gender: undefined },
				pt: { name: 'Limão', gender: 'masculine' as const }
			}
		};

		expect(toBarIngredient(ingredient)).toEqual(stored(1, 'Lime', 'Limão'));
	});
});

describe('isDrinkMatchMaxMissing', () => {
	it.each([0, 1, 2, 'any'])('accepts %s', (value) =>
		expect(isDrinkMatchMaxMissing(value)).toBe(true)
	);
	it.each([3, '0', 'none', null])('rejects %s', (value) =>
		expect(isDrinkMatchMaxMissing(value)).toBe(false)
	);
});

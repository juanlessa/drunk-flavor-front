import { describe, expect, it } from 'vitest';
import type { Drink, DrinkMatch } from '~/domain/drink/drink.entity';
import {
	getMissingIngredientNames,
	getMissingRequiredIngredientIds,
	getWiderMaxMissing,
	groupMatchesByMissingCount
} from './drinkMatch.helpers';

const match = (id: string, missingCount: number): DrinkMatch => ({
	drink: { id } as Drink,
	missingCount,
	missingIngredientIds: []
});
const idsOf = (matches: DrinkMatch[]) => matches.map(({ drink }) => drink.id);

describe('groupMatchesByMissingCount', () => {
	it('groups the matches by how many ingredients are missing, in the order they came', () => {
		const groups = groupMatchesByMissingCount([
			match('a', 0),
			match('b', 0),
			match('c', 1),
			match('d', 3)
		]);

		expect(groups.map(({ missingCount, matches }) => [missingCount, idsOf(matches)])).toEqual([
			[0, ['a', 'b']],
			[1, ['c']],
			[3, ['d']]
		]);
	});

	it('grows the last group when the next page goes on with it', () => {
		const firstPage = [match('a', 0), match('b', 1)];
		const nextPage = [match('c', 1), match('d', 2)];

		const groups = groupMatchesByMissingCount([...firstPage, ...nextPage]);

		expect(groups.map(({ missingCount, matches }) => [missingCount, idsOf(matches)])).toEqual([
			[0, ['a']],
			[1, ['b', 'c']],
			[2, ['d']]
		]);
	});

	it('returns no group when there is no match', () => {
		expect(groupMatchesByMissingCount([])).toEqual([]);
	});
});

describe('getMissingIngredientNames', () => {
	const ingredient = (id: string, en: string, pt: string) => ({
		ingredient: { id, translations: { en: { name: en }, pt: { name: pt } } },
		optional: false
	});
	const drink = {
		ingredients: [
			ingredient('rum', 'White rum', 'Rum branco'),
			ingredient('lime', 'Lime', 'Limão'),
			ingredient('mint', 'Mint', 'Hortelã'),
			ingredient('rum', 'White rum', 'Rum branco')
		]
	} as unknown as Pick<Drink, 'ingredients'>;

	it('names the missing ingredients in the language asked for, in recipe order', () => {
		expect(getMissingIngredientNames(drink, ['mint', 'rum'], 'pt')).toEqual([
			'Rum branco',
			'Hortelã'
		]);
		expect(getMissingIngredientNames(drink, ['mint', 'rum'], 'en')).toEqual([
			'White rum',
			'Mint'
		]);
	});

	it('names an ingredient that appears twice in the recipe only once', () => {
		expect(getMissingIngredientNames(drink, ['rum'], 'en')).toEqual(['White rum']);
	});

	it('leaves out an id that is not in the recipe and returns nothing when none is missing', () => {
		expect(getMissingIngredientNames(drink, ['unknown'], 'en')).toEqual([]);
		expect(getMissingIngredientNames(drink, [], 'en')).toEqual([]);
	});
});

describe('getMissingRequiredIngredientIds', () => {
	const line = (id: string, optional = false) => ({ ingredient: { id }, optional });
	const drink = {
		ingredients: [line('rum'), line('lime'), line('mint'), line('soda', true), line('rum')]
	} as unknown as Pick<Drink, 'ingredients'>;

	it('lists the required ingredients the person does not have, in recipe order', () => {
		expect(getMissingRequiredIngredientIds(drink, ['lime'])).toEqual(['rum', 'mint']);
	});
	it('never counts an optional ingredient as missing', () => {
		expect(getMissingRequiredIngredientIds(drink, ['rum', 'lime', 'mint'])).toEqual([]);
	});
	it('lists an ingredient that appears twice in the recipe only once', () => {
		expect(getMissingRequiredIngredientIds(drink, ['lime', 'mint'])).toEqual(['rum']);
	});
	it('lists every required ingredient when the person has none of them', () => {
		expect(getMissingRequiredIngredientIds(drink, [])).toEqual(['rum', 'lime', 'mint']);
	});
});
describe('getWiderMaxMissing', () => {
	it.each([
		[0, 1],
		[1, 2],
		[2, 'any']
	] as const)('offers %s → %s when nothing is found', (current, wider) => {
		expect(getWiderMaxMissing(current)).toBe(wider);
	});

	it('offers nothing wider than any', () => {
		expect(getWiderMaxMissing('any')).toBeUndefined();
	});
});

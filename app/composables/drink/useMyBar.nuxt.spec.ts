import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { DRINK_MATCH_MAX_INGREDIENTS } from '~/domain/drink/drink.constants';
import type { Ingredient } from '~/domain/ingredient/ingredient.entity';
import { MY_BAR_STORAGE_KEY, useMyBar } from './useMyBar';

const id = (index: number) => index.toString(16).padStart(24, '0');
const ingredient = (index: number, name = `Ingredient ${index}`) =>
	({
		id: id(index),
		translations: {
			en: { name, namePlural: `${name}s` },
			pt: { name: `${name} pt`, namePlural: `${name} pt plural` }
		}
	}) as unknown as Pick<Ingredient, 'id' | 'translations'>;

const readStorage = () => JSON.parse(localStorage.getItem(MY_BAR_STORAGE_KEY) ?? 'null');

describe('useMyBar', () => {
	beforeEach(() => localStorage.clear());
	afterEach(() => localStorage.clear());

	it('starts empty, matching only drinks with nothing missing', () => {
		const bar = useMyBar();

		expect(bar.ingredients.value).toEqual([]);
		expect(bar.ingredientIds.value).toEqual([]);
		expect(bar.maxMissing.value).toBe(0);
		expect(bar.isFull.value).toBe(false);
	});

	it('keeps the added ingredients, with only their names, in the browser', async () => {
		const bar = useMyBar();

		expect(bar.add(ingredient(1, 'Gin'))).toBe(true);
		expect(bar.add(ingredient(2, 'Lime'))).toBe(true);
		await nextTick();

		expect(bar.ingredientIds.value).toEqual([id(1), id(2)]);
		expect(readStorage()).toEqual({
			ingredients: [
				{ id: id(1), translations: { en: { name: 'Gin' }, pt: { name: 'Gin pt' } } },
				{ id: id(2), translations: { en: { name: 'Lime' }, pt: { name: 'Lime pt' } } }
			],
			maxMissing: 0
		});
	});

	it('restores the bar kept on a previous visit', () => {
		localStorage.setItem(
			MY_BAR_STORAGE_KEY,
			JSON.stringify({
				ingredients: [
					{ id: id(1), translations: { en: { name: 'Gin' }, pt: { name: 'Gin' } } }
				],
				maxMissing: 'any'
			})
		);

		const bar = useMyBar();

		expect(bar.ingredientIds.value).toEqual([id(1)]);
		expect(bar.maxMissing.value).toBe('any');
	});

	it('reads a broken storage as an empty bar', () => {
		localStorage.setItem(MY_BAR_STORAGE_KEY, '{not json');

		const bar = useMyBar();

		expect(bar.ingredients.value).toEqual([]);
		expect(bar.maxMissing.value).toBe(0);
	});

	it('leaves out an ingredient already in the bar', () => {
		const bar = useMyBar();
		bar.add(ingredient(1));

		expect(bar.add(ingredient(1, 'Renamed'))).toBe(false);
		expect(bar.ingredients.value).toHaveLength(1);
	});

	it('stops adding once the bar holds as many ingredients as the match accepts', () => {
		const bar = useMyBar();
		for (let index = 1; index < DRINK_MATCH_MAX_INGREDIENTS; index++)
			bar.add(ingredient(index));
		expect(bar.isFull.value).toBe(false);

		expect(bar.add(ingredient(DRINK_MATCH_MAX_INGREDIENTS))).toBe(true);
		expect(bar.isFull.value).toBe(true);
		expect(bar.add(ingredient(DRINK_MATCH_MAX_INGREDIENTS + 1))).toBe(false);
		expect(bar.ingredients.value).toHaveLength(DRINK_MATCH_MAX_INGREDIENTS);
	});

	it('removes a single ingredient', () => {
		const bar = useMyBar();
		bar.add(ingredient(1));
		bar.add(ingredient(2));

		bar.remove(id(1));

		expect(bar.ingredientIds.value).toEqual([id(2)]);
	});

	it('keeps the way to match when the bar is emptied', async () => {
		const bar = useMyBar();
		bar.add(ingredient(1));
		bar.maxMissing.value = 2;

		bar.clear();
		await nextTick();

		expect(bar.ingredients.value).toEqual([]);
		expect(bar.maxMissing.value).toBe(2);
		expect(readStorage()).toEqual({ ingredients: [], maxMissing: 2 });
	});
});

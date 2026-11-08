import { describe, expect, it } from 'vitest';
import { buildIngredient, buildLine, buildUnit, leaf, milliliter } from '~/test/drink.fixtures';
import {
	buildItemChoices,
	cleanAmount,
	emptyItemRef,
	getLineUnit,
	getLineUnitId,
	getRecipeItemKey,
	hasItem,
	hasQuantity,
	toRecipeItemRef
} from './recipe.helpers';

const gin = buildIngredient('gin', 'Gin');
const mint = buildIngredient('mint', 'Mint', [leaf, milliliter]);
const foam = buildIngredient('foam', 'Foam', []);

describe('getLineUnitId and getLineUnit', () => {
	it('reads the unit of an exact amount and of the hint of a qualitative one', () => {
		expect(getLineUnitId(buildLine(gin))).toBe('ml');
		expect(
			getLineUnitId(
				buildLine(gin, {
					type: 'qualitative',
					qualifier: 'top_up',
					quantity: 10,
					unitId: 'ml'
				})
			)
		).toBe('ml');
		expect(getLineUnit(buildLine(mint, { type: 'exact', quantity: 2, unitId: 'leaf' }))).toBe(
			leaf
		);
	});

	it('has none for an amount that is not measured in a unit', () => {
		expect(getLineUnitId(buildLine(foam, { type: 'none' }))).toBeUndefined();
		expect(
			getLineUnitId(buildLine(gin, { type: 'qualitative', qualifier: 'to_taste' }))
		).toBeUndefined();
		expect(getLineUnit(buildLine(foam, { type: 'none' }))).toBeUndefined();
	});
});

describe('toRecipeItemRef', () => {
	it('points at the line with its unit', () => {
		expect(toRecipeItemRef('ingredients', buildLine(gin))).toEqual({
			list: 'ingredients',
			ingredientId: 'gin',
			unitId: 'ml'
		});
	});

	it('names the unit only when asked, and only when the line has one', () => {
		expect(toRecipeItemRef('garnishes', buildLine(gin), true).withUnit).toBe(true);
		expect(toRecipeItemRef('garnishes', buildLine(gin)).withUnit).toBeUndefined();
		expect(toRecipeItemRef('garnishes', buildLine(foam, { type: 'none' }), true)).toEqual({
			list: 'garnishes',
			ingredientId: 'foam'
		});
	});
});

describe('getRecipeItemKey', () => {
	it('tells the lines apart by list, ingredient and unit', () => {
		const keys = [
			getRecipeItemKey({ list: 'ingredients', ingredientId: 'mint', unitId: 'leaf' }),
			getRecipeItemKey({ list: 'ingredients', ingredientId: 'mint', unitId: 'ml' }),
			getRecipeItemKey({ list: 'garnishes', ingredientId: 'mint', unitId: 'leaf' }),
			getRecipeItemKey({ list: 'ingredients', ingredientId: 'mint' })
		];

		expect(new Set(keys).size).toBe(4);
	});

	it('is the same for two references to the same line, whether or not they name the unit', () => {
		expect(
			getRecipeItemKey({
				list: 'ingredients',
				ingredientId: 'gin',
				unitId: 'ml',
				withUnit: true
			})
		).toBe(getRecipeItemKey({ list: 'ingredients', ingredientId: 'gin', unitId: 'ml' }));
	});
});

describe('buildItemChoices', () => {
	const lines = {
		ingredients: [buildLine(gin), buildLine(foam, { type: 'none' })],
		garnishes: [buildLine(mint, { type: 'exact', quantity: 2, unitId: 'leaf' })]
	};

	it('offers the lines of the lists asked for, in order, with the names in the language', () => {
		const choices = buildItemChoices(lines, ['ingredients', 'garnishes'], 'en');

		expect(choices.map(({ list, name, unitName }) => [list, name, unitName])).toEqual([
			['ingredients', 'Gin', 'ml'],
			['ingredients', 'Foam', undefined],
			['garnishes', 'Mint', 'leaf']
		]);
	});

	it('offers only the lists asked for', () => {
		expect(buildItemChoices(lines, ['garnishes'], 'pt').map(({ name }) => name)).toEqual([
			'Mint'
		]);
	});

	it('gives each choice the reference and the key of its line', () => {
		const [choice] = buildItemChoices(lines, ['ingredients'], 'en');

		expect(choice!.ref).toEqual({ list: 'ingredients', ingredientId: 'gin', unitId: 'ml' });
		expect(choice!.key).toBe(getRecipeItemKey(choice!.ref));
	});

	it('is empty for a list the drink does not have', () => {
		expect(buildItemChoices({}, ['ingredients'], 'en')).toEqual([]);
	});

	it('writes the name of a unit without a symbol in the language', () => {
		const unit = buildUnit('bar', {
			translations: {
				en: { name: 'bar spoon', namePlural: 'bar spoons' },
				pt: { name: 'colher de bar', namePlural: 'colheres de bar' }
			}
		});
		const syrup = buildIngredient('syrup', 'Syrup', [unit]);

		expect(
			buildItemChoices({ ingredients: [buildLine(syrup)] }, ['ingredients'], 'pt')[0]!
				.unitName
		).toBe('colher de bar');
	});
});

describe('hasQuantity and cleanAmount', () => {
	it('tells a quantity above zero from none', () => {
		expect(hasQuantity({ type: 'exact', quantity: 1, unitId: 'ml' })).toBe(true);
		expect(hasQuantity({ type: 'exact', quantity: 0, unitId: 'ml' })).toBe(false);
		expect(hasQuantity({ type: 'none' })).toBe(false);
		expect(hasQuantity({ type: 'qualitative', qualifier: 'to_taste' })).toBe(false);
	});

	it('leaves exact and none amounts as they are', () => {
		const exact = { type: 'exact', quantity: 5, unitId: 'ml' } as const;

		expect(cleanAmount(exact)).toBe(exact);
		expect(cleanAmount({ type: 'none' })).toEqual({ type: 'none' });
	});

	it('removes the empty hint of a qualitative amount and keeps a real one', () => {
		expect(
			cleanAmount({ type: 'qualitative', qualifier: 'top_up', quantity: 0, unitId: 'ml' })
		).toEqual({ type: 'qualitative', qualifier: 'top_up' });
		expect(
			cleanAmount({ type: 'qualitative', qualifier: 'top_up', quantity: 10, unitId: 'ml' })
		).toEqual({ type: 'qualitative', qualifier: 'top_up', quantity: 10, unitId: 'ml' });
	});
});

describe('emptyItemRef and hasItem', () => {
	it('points at nothing until an ingredient is chosen', () => {
		expect(hasItem(emptyItemRef('garnishes'))).toBe(false);
		expect(hasItem(undefined)).toBe(false);
		expect(hasItem({ list: 'garnishes', ingredientId: 'salt' })).toBe(true);
	});
});

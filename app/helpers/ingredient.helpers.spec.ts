import { describe, expect, it } from 'vitest';
import type { Ingredient } from '~/domain/ingredient/ingredient.entity';
import type { Unit } from '~/domain/unit/unit.entity';
import {
	getIngredientNameForQuantity,
	getIngredientPreviewItems,
	getIngredientSummary,
	getPrimaryUnit
} from './ingredient.helpers';

const buildIngredient = (unit: { symbol?: string; en: string; pt: string }) =>
	({
		category: {
			translations: { en: { name: 'Spirit' }, pt: { name: 'Destilado' } }
		},
		units: [
			{
				symbol: unit.symbol,
				translations: {
					en: { name: unit.en, namePlural: `${unit.en}s` },
					pt: { name: unit.pt, namePlural: `${unit.pt}s` }
				}
			}
		]
	}) as unknown as Pick<Ingredient, 'category' | 'units'>;

describe('ingredient helpers', () => {
	it('joins the category name and the unit symbol', () => {
		const ingredient = buildIngredient({ symbol: 'ml', en: 'milliliter', pt: 'mililitro' });

		expect(getIngredientSummary(ingredient, 'en')).toBe('Spirit · ml');
	});

	it('falls back to the translated unit name when the unit has no symbol', () => {
		const ingredient = buildIngredient({ en: 'leaf', pt: 'folha' });

		expect(getIngredientSummary(ingredient, 'pt')).toBe('Destilado · folha');
	});
});

describe('ingredient units', () => {
	it('shows the first allowed unit and ignores the others', () => {
		const ingredient = buildIngredient({ symbol: 'ml', en: 'milliliter', pt: 'mililitro' });
		const first = ingredient.units[0] as Unit;
		ingredient.units.push({ ...first, symbol: 'g' } as Unit);
		expect(getPrimaryUnit(ingredient)).toBe(first);
		expect(getIngredientSummary(ingredient, 'en')).toBe('Spirit · ml');
	});
	it('shows only the category for an ingredient that is not measurable', () => {
		const ingredient = { ...buildIngredient({ en: 'leaf', pt: 'folha' }), units: [] };
		expect(getPrimaryUnit(ingredient)).toBeUndefined();
		expect(getIngredientSummary(ingredient, 'en')).toBe('Spirit');
	});
});
describe('getIngredientPreviewItems', () => {
	const milliliter = {
		symbol: 'ml',
		spaceBeforeSymbol: true,
		allowDecimal: true,
		translations: {
			en: { name: 'milliliter', namePlural: 'milliliters' },
			pt: { name: 'mililitro', namePlural: 'mililitros' }
		}
	};
	const leaf = {
		symbol: undefined,
		spaceBeforeSymbol: false,
		allowDecimal: false,
		translations: {
			en: { name: 'leaf', namePlural: 'leaves' },
			pt: { name: 'folha', namePlural: 'folhas' }
		}
	};

	it('writes the quantities as on the drink page', () => {
		expect(getIngredientPreviewItems(' Gin ', milliliter, 'en', 'of')).toEqual([
			'1 ml of Gin',
			'60 ml of Gin',
			'1.5 ml of Gin'
		]);
	});

	it('uses the singular and plural names and no decimal example for a whole, symbol-less unit', () => {
		expect(getIngredientPreviewItems('Hortelã', leaf, 'pt', 'de')).toEqual([
			'1 folha de Hortelã',
			'2 folhas de Hortelã'
		]);
	});

	it('is empty until both the name and the unit are known', () => {
		expect(getIngredientPreviewItems('', milliliter, 'en', 'of')).toEqual([]);
		expect(getIngredientPreviewItems('Gin', undefined, 'en', 'of')).toEqual([]);
	});
});
describe('getIngredientPreviewItems for a unit written with the ingredient name', () => {
	const each = {
		symbol: undefined,
		spaceBeforeSymbol: false,
		allowDecimal: false,
		useIngredientName: true,
		translations: {
			en: { name: 'unit', namePlural: 'units' },
			pt: { name: 'unidade', namePlural: 'unidades' }
		}
	};
	it('writes the name and the plural name with no "of"', () => {
		expect(getIngredientPreviewItems(' Lime ', each, 'en', 'of', ' Limes ')).toEqual([
			'1 Lime',
			'2 Limes'
		]);
		expect(getIngredientPreviewItems('Limão', each, 'pt', 'de', 'Limões')).toEqual([
			'1 Limão',
			'2 Limões'
		]);
	});
	it('adds the decimal example by the plural rules of the language when decimals are allowed', () => {
		const decimal = { ...each, allowDecimal: true };
		expect(getIngredientPreviewItems('Lime', decimal, 'en', 'of', 'Limes')).toEqual([
			'1 Lime',
			'2 Limes',
			'1.5 Limes'
		]);
		expect(getIngredientPreviewItems('Limão', decimal, 'pt', 'de', 'Limões')).toEqual([
			'1 Limão',
			'2 Limões',
			'1,5 Limão'
		]);
	});
	it('leaves out the plural examples until the plural name is filled in', () => {
		expect(getIngredientPreviewItems('Lime', each, 'en', 'of')).toEqual(['1 Lime']);
		expect(getIngredientPreviewItems('Lime', each, 'en', 'of', '   ')).toEqual(['1 Lime']);
	});
	it('is empty until the name is known', () => {
		expect(getIngredientPreviewItems('', each, 'en', 'of', 'Limes')).toEqual([]);
	});
	it('ignores the plural name for a unit that is not written with the ingredient name', () => {
		const wedge = { ...each, useIngredientName: false };
		expect(getIngredientPreviewItems('Lime', wedge, 'en', 'of', 'Limes')).toEqual([
			'1 unit of Lime',
			'2 units of Lime'
		]);
	});
});
describe('getIngredientNameForQuantity', () => {
	const lime = {
		translations: {
			en: { name: 'Lime', namePlural: 'Limes' },
			pt: { name: 'Limão', namePlural: 'Limões' }
		}
	};
	it('uses the name where the quantity reads in the singular and the plural name elsewhere', () => {
		expect(getIngredientNameForQuantity(lime, 1, 'en')).toBe('Lime');
		expect(getIngredientNameForQuantity(lime, 3, 'en')).toBe('Limes');
		expect(getIngredientNameForQuantity(lime, 1.5, 'pt')).toBe('Limão');
		expect(getIngredientNameForQuantity(lime, 3, 'pt')).toBe('Limões');
	});
	it('falls back to the name when there is no plural name', () => {
		const gin = {
			translations: { en: { name: 'Gin' }, pt: { name: 'Gin', namePlural: '  ' } }
		};
		expect(getIngredientNameForQuantity(gin, 3, 'en')).toBe('Gin');
		expect(getIngredientNameForQuantity(gin, 3, 'pt')).toBe('Gin');
	});
});

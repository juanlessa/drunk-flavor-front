import { describe, expect, it } from 'vitest';
import type { Ingredient } from '~/domain/ingredient/ingredient.entity';
import { getIngredientPreviewItems, getIngredientSummary } from './ingredient.helpers';

const buildIngredient = (unit: { symbol?: string; en: string; pt: string }) =>
	({
		category: {
			translations: { en: { name: 'Spirit' }, pt: { name: 'Destilado' } }
		},
		unit: {
			symbol: unit.symbol,
			translations: {
				en: { name: unit.en, namePlural: `${unit.en}s` },
				pt: { name: unit.pt, namePlural: `${unit.pt}s` }
			}
		}
	}) as unknown as Pick<Ingredient, 'category' | 'unit'>;

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

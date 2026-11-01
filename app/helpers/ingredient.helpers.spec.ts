import { describe, expect, it } from 'vitest';
import type { Ingredient } from '~/domain/ingredient/ingredient.entity';
import { getIngredientSummary } from './ingredient.helpers';

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

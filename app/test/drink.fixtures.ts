import type { DrinkIngredientAmountRequest } from '~/domain/drink/drink.dtos';
import type { Ingredient } from '~/domain/ingredient/ingredient.entity';
import type { Unit } from '~/domain/unit/unit.entity';
import type { DrinkRecipeLineForm } from '~/types/drink.types';

// Fixtures of the drink form tests: units, ingredients and recipe lines with just the fields the form reads.

export const buildUnit = (id: string, overrides: Partial<Unit> = {}): Unit => ({
	id,
	translations: {
		en: { name: `unit ${id}`, namePlural: `units ${id}` },
		pt: { name: `unidade ${id}`, namePlural: `unidades ${id}`, gender: 'feminine' }
	},
	symbol: undefined,
	spaceBeforeSymbol: false,
	allowDecimal: true,
	kind: 'volume',
	createdAt: new Date(),
	updatedAt: new Date(),
	...overrides
});

export const milliliter = buildUnit('ml', {
	symbol: 'ml',
	translations: {
		en: { name: 'milliliter', namePlural: 'milliliters' },
		pt: { name: 'mililitro', namePlural: 'mililitros', gender: 'masculine' }
	}
});
export const leaf = buildUnit('leaf', {
	allowDecimal: false,
	translations: {
		en: { name: 'leaf', namePlural: 'leaves' },
		pt: { name: 'folha', namePlural: 'folhas', gender: 'feminine' }
	}
});

export const buildIngredient = (
	id: string,
	name = id,
	units: Unit[] = [milliliter]
): Ingredient => ({
	id,
	translations: { en: { name }, pt: { name, gender: 'masculine' } },
	category: {
		id: 'cat-1',
		translations: { en: { name: 'Spirit' }, pt: { name: 'Destilado' } },
		isAlcoholic: true,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	units,
	kind: 'generic',
	createdAt: new Date(),
	updatedAt: new Date()
});

export const buildLine = (
	ingredient: Ingredient,
	amount?: DrinkIngredientAmountRequest,
	optional = false
): DrinkRecipeLineForm => ({
	ingredient,
	optional,
	amount: amount ?? { type: 'exact', quantity: 60, unitId: ingredient.units[0]?.id ?? '' }
});

import { describe, expect, it } from 'vitest';
import type { UnitForm } from '~/types/unit.types';
import { unitFormValidator } from './unit';

const buildForm = (gender?: UnitForm['translations']['pt']['gender']): UnitForm => ({
	translations: {
		en: { name: 'leaf', namePlural: 'leaves' },
		pt: { name: 'folha', namePlural: 'folhas', ...(gender && { gender }) }
	},
	symbol: '',
	spaceBeforeSymbol: false,
	allowDecimal: false,
	useIngredientName: false,
	kind: 'count'
});

describe('unitFormValidator', () => {
	it('flags a missing gender in Portuguese with a translatable key', () => {
		expect(unitFormValidator(buildForm())).toEqual([
			{ field: 'translations.pt.gender', message: 'errors.units.gender' }
		]);
	});

	it.each(['masculine', 'feminine'] as const)('accepts the %s gender', (gender) => {
		expect(unitFormValidator(buildForm(gender))).toEqual([]);
	});

	it('does not ask for a gender in English', () => {
		const errors = unitFormValidator(buildForm('feminine'));

		expect(errors.map(({ field }) => field)).not.toContain('translations.en.gender');
	});

	describe('written with the ingredient name', () => {
		const eachForm = (overrides: Partial<UnitForm> = {}) => ({
			...buildForm('feminine'),
			useIngredientName: true,
			...overrides
		});
		it('accepts a count unit without a symbol', () => {
			expect(unitFormValidator(eachForm())).toEqual([]);
		});
		it('accepts a unit that is not written with the ingredient name, whatever its kind and symbol', () => {
			expect(
				unitFormValidator({ ...buildForm('feminine'), kind: 'volume', symbol: 'ml' })
			).toEqual([]);
		});
		it('flags a kind other than count on the kind field', () => {
			expect(unitFormValidator(eachForm({ kind: 'volume' }))).toEqual([
				{ field: 'kind', message: 'errors.units.ingredientNameKind' }
			]);
		});
		it('flags a symbol on the symbol field, and blank spaces are not a symbol', () => {
			expect(unitFormValidator(eachForm({ symbol: 'u' }))).toEqual([
				{ field: 'symbol', message: 'errors.units.ingredientNameSymbol' }
			]);
			expect(unitFormValidator(eachForm({ symbol: '   ' }))).toEqual([]);
		});
		it('flags both the kind and the symbol when both are wrong', () => {
			const fields = unitFormValidator(eachForm({ kind: 'mass', symbol: 'g' })).map(
				({ field }) => field
			);
			expect(fields.sort()).toEqual(['kind', 'symbol']);
		});
	});
});

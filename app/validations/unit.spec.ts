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
});

import { describe, it, expect } from 'vitest';
import { mapFormToCreateUnit, mapFormToUpdateUnit, mapUnitToForm } from './unit.mappers';
import type { UnitForm } from '~/types/unit.types';
import type { Unit } from '~/domain/unit/unit.entity';

const buildForm = (overrides: Partial<UnitForm> = {}): UnitForm => ({
	translations: {
		en: { name: 'milliliter', namePlural: 'milliliters' },
		pt: { name: 'mililitro', namePlural: 'mililitros' }
	},
	symbol: 'ml',
	spaceBeforeSymbol: false,
	allowDecimal: true,
	kind: 'volume',
	...overrides
});

describe('mapUnitToForm', () => {
	it('maps a missing symbol to an empty string', () => {
		const unit: Unit = {
			id: 'unit-1',
			translations: buildForm().translations,
			allowDecimal: false,
			kind: 'count',
			createdAt: new Date(),
			updatedAt: new Date()
		};

		expect(mapUnitToForm(unit).symbol).toBe('');
	});
});

describe('gender', () => {
	const gendered = buildForm({
		translations: {
			en: { name: 'leaf', namePlural: 'leaves' },
			pt: { name: 'folha', namePlural: 'folhas', gender: 'feminine' }
		}
	});

	it('keeps the gender of the unit in the form', () => {
		const unit: Unit = {
			id: 'unit-1',
			translations: gendered.translations,
			allowDecimal: false,
			kind: 'count',
			createdAt: new Date(),
			updatedAt: new Date()
		};

		expect(mapUnitToForm(unit).translations.pt.gender).toBe('feminine');
	});

	it('sends the gender on create and on update', () => {
		expect(mapFormToCreateUnit(gendered).translations.pt.gender).toBe('feminine');
		expect(mapFormToUpdateUnit('unit-1', gendered).translations.pt.gender).toBe('feminine');
	});
});
describe('mapFormToCreateUnit', () => {
	it('omits an empty symbol', () => {
		expect(mapFormToCreateUnit(buildForm({ symbol: '  ' })).symbol).toBeUndefined();
	});

	it('sends a trimmed symbol', () => {
		expect(mapFormToCreateUnit(buildForm({ symbol: ' mL ' })).symbol).toBe('mL');
	});
});

describe('mapFormToUpdateUnit', () => {
	it('sends null to remove the symbol when it is empty', () => {
		const result = mapFormToUpdateUnit('unit-1', buildForm({ symbol: '' }));

		expect(result.id).toBe('unit-1');
		expect(result.symbol).toBeNull();
	});

	it('sends the symbol when it is set', () => {
		expect(mapFormToUpdateUnit('unit-1', buildForm()).symbol).toBe('ml');
	});
});

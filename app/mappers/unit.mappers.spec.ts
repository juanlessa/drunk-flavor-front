import { describe, it, expect } from 'vitest';
import { mapFormToCreateUnit, mapFormToUpdateUnit, mapUnitToForm } from './unit.mappers';
import type { UnitForm } from '~/types/unit.types';
import type { Unit } from '~/domain/unit/unit.entity';

const buildForm = (overrides: Partial<UnitForm> = {}): UnitForm => ({
	translations: {
		en: { name: 'milliliter', name_plural: 'milliliters' },
		pt: { name: 'mililitro', name_plural: 'mililitros' }
	},
	symbol: 'ml',
	space_before_symbol: false,
	allow_decimal: true,
	kind: 'volume',
	...overrides
});

describe('mapUnitToForm', () => {
	it('maps a missing symbol to an empty string', () => {
		const unit: Unit = {
			_id: 'unit-1',
			translations: buildForm().translations,
			allow_decimal: false,
			kind: 'count',
			created_at: new Date(),
			updated_at: new Date()
		};

		expect(mapUnitToForm(unit).symbol).toBe('');
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
